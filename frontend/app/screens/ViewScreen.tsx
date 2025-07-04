import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import { unlockText } from '../../utils/api';
import { decryptText } from '../../utils/crypto';
import { MotiView, useAnimationState } from 'moti';
import Button from '../../components/Button';
import Input from '../../components/Input';

type ViewRouteProp = RouteProp<RootStackParamList, 'View'>;

const schema = z.object({
  key: z.string().min(1, 'Key is required'),
});

type FormData = z.infer<typeof schema>;

export default function ViewScreen() {
  const route = useRoute<ViewRouteProp>();
  const { id } = route.params;
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [decrypted, setDecrypted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const errorAnim = useAnimationState({
    from: { translateX: 0 },
    shake: { translateX: -10 },
    reset: { translateX: 0 },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setDecrypted(null);
    try {
      const { encrypted_text } = await unlockText(id);
      const plain = await decryptText(encrypted_text, data.key);
      setDecrypted(plain);
    } catch (e: any) {
      setError(e.message || 'Incorrect key or corrupted data');
      errorAnim.transitionTo('shake');
      setTimeout(() => errorAnim.transitionTo('reset'), 300);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Unlock Text</Text>
      <Controller
        control={control}
        name="key"
        render={({ field: { onChange, value } }) => (
          <Input
            className="mb-2"
            placeholder="Enter the passphrase"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.key && <Text style={{ color: 'red', marginBottom: 8 }}>{errors.key.message}</Text>}
      <Button
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          'Unlock'
        )}
      </Button>
      {decrypted && (
        <View style={{ marginTop: 16, padding: 16, backgroundColor: '#d1fae5', borderRadius: 8 }}>
          <Text style={{ color: '#065f46' }}>{decrypted}</Text>
        </View>
      )}
      {error && (
        <MotiView
          state={errorAnim}
          style={{ marginTop: 8 }}
          transition={{ type: 'timing', duration: 100 }}
        >
          <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>
        </MotiView>
      )}
    </View>
  );
} 