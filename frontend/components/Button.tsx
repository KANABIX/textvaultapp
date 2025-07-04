import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
// @ts-ignore // If you see a linter error here, ensure NativeWind v3+ is installed. This import is correct for v3+.
import { styled } from 'nativewind/react';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  className?: string;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <StyledTouchableOpacity
      className={`bg-blue-600 rounded p-3 ${className}`}
      {...props}
    >
      <StyledText className="text-white text-center font-semibold">{children}</StyledText>
    </StyledTouchableOpacity>
  );
} 