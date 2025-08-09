import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);

export default function AnalyticsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StyledView className="flex-1 items-center justify-center px-8">
        <Ionicons name="analytics-outline" size={64} color="#10b981" />
        <StyledText className="text-2xl font-bold text-gray-900 mt-4 mb-2">
          Analytics Dashboard
        </StyledText>
        <StyledText className="text-gray-600 text-center">
          Track your collection value, growth, and insights
        </StyledText>
        <StyledText className="text-sm text-gray-500 mt-4">
          Coming soon...
        </StyledText>
      </StyledView>
    </SafeAreaView>
  );
}