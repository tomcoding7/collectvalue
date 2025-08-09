import React, { forwardRef } from 'react';
import { TextInput, Text, View, TextInputProps, ViewStyle } from 'react-native';
import { styled } from 'nativewind';

const StyledTextInput = styled(TextInput);
const StyledText = styled(Text);
const StyledView = styled(View);

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}, ref) => {
  const getInputClasses = () => {
    const baseClasses = 'flex-1 px-3 py-2 text-base';
    const borderClasses = error 
      ? 'border-red-500' 
      : 'border-gray-300 focus:border-primary-500';
    
    return `${baseClasses} border rounded-lg ${borderClasses}`;
  };

  return (
    <StyledView className="mb-4" style={containerStyle}>
      {label && (
        <StyledText className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </StyledText>
      )}
      
      <StyledView className="flex-row items-center">
        {leftIcon && (
          <StyledView className="absolute left-3 z-10">
            {leftIcon}
          </StyledView>
        )}
        
        <StyledTextInput
          ref={ref}
          className={getInputClasses()}
          style={[
            leftIcon && { paddingLeft: 40 },
            rightIcon && { paddingRight: 40 },
            style
          ]}
          placeholderTextColor="#9CA3AF"
          {...props}
        />
        
        {rightIcon && (
          <StyledView className="absolute right-3 z-10">
            {rightIcon}
          </StyledView>
        )}
      </StyledView>
      
      {(error || helper) && (
        <StyledText 
          className={`text-sm mt-1 ${error ? 'text-red-500' : 'text-gray-500'}`}
        >
          {error || helper}
        </StyledText>
      )}
    </StyledView>
  );
}); 