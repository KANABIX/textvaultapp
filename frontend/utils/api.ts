const API_URL = 'http://localhost:5000/api';

export async function lockText(encrypted_text: string): Promise<{ id: string }> {
  const res = await fetch(`${API_URL}/lock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encrypted_text }),
  });
  if (!res.ok) throw new Error('Failed to lock text');
  return res.json();
}

export async function unlockText(id: string): Promise<{ encrypted_text: string }> {
  const res = await fetch(`${API_URL}/unlock/${id}`);
  if (!res.ok) throw new Error('Failed to fetch encrypted text');
  return res.json();
} 