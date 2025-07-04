import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
// @ts-ignore // If you see a linter error here, ensure NativeWind v3+ is installed. This import is correct for v3+.
import { styled } from 'nativewind/react';

const StyledTextInput = styled(TextInput);

interface InputProps extends TextInputProps {
  className?: string;
}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <StyledTextInput
      className={`border rounded p-2 ${className}`}
      {...props}
    />
  );
} 