import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'flex-row items-center justify-center rounded-lg';
    const widthClasses = fullWidth ? 'w-full' : '';
    
    const variantClasses = {
      primary: 'bg-primary-600 active:bg-primary-700',
      secondary: 'bg-secondary-600 active:bg-secondary-700',
      outline: 'border border-primary-600 bg-transparent',
      ghost: 'bg-transparent',
      danger: 'bg-red-600 active:bg-red-700',
    };
    
    const sizeClasses = {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    };
    
    const disabledClasses = disabled || loading ? 'opacity-50' : '';
    
    return `${baseClasses} ${widthClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses}`;
  };

  const getTextClasses = () => {
    const baseClasses = 'font-medium text-center';
    
    const variantTextClasses = {
      primary: 'text-white',
      secondary: 'text-white',
      outline: 'text-primary-600',
      ghost: 'text-primary-600',
      danger: 'text-white',
    };
    
    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };
    
    return `${baseClasses} ${variantTextClasses[variant]} ${sizeClasses[size]}`;
  };

  return (
    <StyledTouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? '#2563eb' : '#ffffff'} 
        />
      ) : (
        <StyledText className={getTextClasses()} style={textStyle}>
          {title}
        </StyledText>
      )}
    </StyledTouchableOpacity>
  );
}; 