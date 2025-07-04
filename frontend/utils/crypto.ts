import { AES, PBKDF2, utils as CryptoUtils } from 'react-native-simple-crypto';

const IV_LENGTH = 12; // 12 bytes for AES-GCM
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 32; // 256 bits
const PBKDF2_DIGEST = 'SHA256';

function toBase64(bytes: ArrayBuffer): string {
  return CryptoUtils.convertArrayBufferToBase64(bytes);
}
function fromBase64(b64: string): ArrayBuffer {
  return CryptoUtils.convertBase64ToArrayBuffer(b64);
}
function toUtf8Bytes(str: string): ArrayBuffer {
  return CryptoUtils.convertUtf8ToArrayBuffer(str);
}
function fromUtf8Bytes(bytes: ArrayBuffer): string {
  return CryptoUtils.convertArrayBufferToUtf8(bytes);
}

async function deriveKey(passphrase: string, salt: ArrayBuffer): Promise<ArrayBuffer> {
  return PBKDF2.hash(
    toUtf8Bytes(passphrase),
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    PBKDF2_DIGEST
  );
}

export async function encryptText(plainText: string, passphrase: string): Promise<string> {
  const iv = await CryptoUtils.randomBytes(IV_LENGTH);
  const salt = await CryptoUtils.randomBytes(16);
  const key = await deriveKey(passphrase, salt);
  const cipherArrayBuffer = await AES.encrypt(
    toUtf8Bytes(plainText),
    key,
    iv
  );
  // We'll output: base64(salt).base64(iv).base64(ciphertext)
  return [toBase64(salt), toBase64(iv), toBase64(cipherArrayBuffer)].join('.');
}

export async function decryptText(encrypted: string, passphrase: string): Promise<string> {
  const [saltB64, ivB64, cipherB64] = encrypted.split('.');
  if (!saltB64 || !ivB64 || !cipherB64) throw new Error('Invalid encrypted format');
  const salt = fromBase64(saltB64);
  const iv = fromBase64(ivB64);
  const cipherArrayBuffer = fromBase64(cipherB64);
  const key = await deriveKey(passphrase, salt);
  const plainArrayBuffer = await AES.decrypt(
    cipherArrayBuffer,
    key,
    iv
  );
  return fromUtf8Bytes(plainArrayBuffer);
} 