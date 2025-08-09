import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';

const StyledView = styled(View);
const StyledText = styled(Text);

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  iconColor?: string;
  iconSize?: number;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  iconColor = '#9ca3af',
  iconSize = 64,
}) => {
  return (
    <StyledView className="flex-1 items-center justify-center px-8">
      <Ionicons name={icon} size={iconSize} color={iconColor} />
      <StyledText className="text-xl font-semibold text-gray-900 mt-4 mb-2 text-center">
        {title}
      </StyledText>
      <StyledText className="text-gray-600 text-center mb-6">
        {description}
      </StyledText>
      {actionText && onAction && (
        <Button
          title={actionText}
          onPress={onAction}
          fullWidth
        />
      )}
    </StyledView>
  );
}; 