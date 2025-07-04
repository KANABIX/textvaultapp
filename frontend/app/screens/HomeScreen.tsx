import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { encryptText } from '../../utils/crypto';
import { lockText } from '../../utils/api';
import { MotiView } from 'moti';
import Button from '../../components/Button';
import Input from '../../components/Input';

const schema = z.object({
  text: z.string().min(1, 'Text is required'),
  key: z.string().min(1, 'Key is required'),
});

type FormData = z.infer<typeof schema>;

type Navigation = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Navigation>();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonPressed, setButtonPressed] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setButtonPressed(true);
    try {
      const encrypted = await encryptText(data.text, data.key);
      const res = await lockText(encrypted);
      navigation.navigate('View', { id: res.id });
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setTimeout(() => setButtonPressed(false), 300);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' }}>Lock Your Text</Text>
      <Controller
        control={control}
        name="text"
        render={({ field: { onChange, value } }) => (
          <Input
            className="mb-2 min-h-[100px]"
            placeholder="Paste your secret text here"
            multiline
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.text && <Text style={{ color: 'red', marginBottom: 8 }}>{errors.text.message}</Text>}
      <Controller
        control={control}
        name="key"
        render={({ field: { onChange, value } }) => (
          <Input
            className="mb-2"
            placeholder="Enter a passphrase"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.key && <Text style={{ color: 'red', marginBottom: 8 }}>{errors.key.message}</Text>}
      <MotiView
        from={{ opacity: 1, scale: 1 }}
        animate={{ opacity: buttonPressed ? 0.7 : 1, scale: buttonPressed ? 0.95 : 1 }}
        transition={{ type: 'timing', duration: 200 }}
      >
        <Button
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            'Lock & Generate Link'
          )}
        </Button>
      </MotiView>
      {error && <Text style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error}</Text>}
    </View>
  );
} 