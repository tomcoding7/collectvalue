import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = '#2563eb',
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <StyledView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size={size} color={color} />
      </StyledView>
    );
  }

  return (
    <StyledView className="items-center justify-center p-4">
      <ActivityIndicator size={size} color={color} />
    </StyledView>
  );
}; 