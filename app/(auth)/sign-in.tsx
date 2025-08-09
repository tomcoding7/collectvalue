import React from 'react';
import { View, Text, Image } from 'react-native';
import { SignIn } from '@clerk/clerk-expo';
import { styled } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);

export default function SignInScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StyledView className="flex-1 px-6 py-8">
        {/* Header */}
        <StyledView className="items-center mb-8">
          <StyledImage
            source={require('../../assets/logo.png')}
            className="w-20 h-20 mb-4"
            resizeMode="contain"
          />
          <StyledText className="text-2xl font-bold text-gray-900 mb-2">
            Welcome Back
          </StyledText>
          <StyledText className="text-gray-600 text-center">
            Sign in to access your collections
          </StyledText>
        </StyledView>

        {/* Sign In Form */}
        <StyledView className="flex-1">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  },
                },
                card: {
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                },
                headerTitle: {
                  display: 'none',
                },
                headerSubtitle: {
                  display: 'none',
                },
                socialButtonsBlockButton: {
                  backgroundColor: '#ffffff',
                  borderColor: '#d1d5db',
                  color: '#374151',
                  '&:hover': {
                    backgroundColor: '#f9fafb',
                  },
                },
                formFieldInput: {
                  backgroundColor: '#ffffff',
                  borderColor: '#d1d5db',
                  borderRadius: '8px',
                  '&:focus': {
                    borderColor: '#2563eb',
                  },
                },
                formFieldLabel: {
                  color: '#374151',
                  fontWeight: '500',
                },
                footerActionLink: {
                  color: '#2563eb',
                  '&:hover': {
                    color: '#1d4ed8',
                  },
                },
              },
            }}
          />
        </StyledView>

        {/* Footer */}
        <StyledView className="items-center mt-8">
          <StyledText className="text-gray-500 text-sm text-center">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </StyledText>
        </StyledView>
      </StyledView>
    </SafeAreaView>
  );
} 