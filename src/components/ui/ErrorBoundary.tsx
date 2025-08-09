import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <StyledView className="flex-1 bg-gray-50 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          
          <StyledText className="text-xl font-semibold text-gray-900 mt-4 mb-2 text-center">
            Oops! Something went wrong
          </StyledText>
          
          <StyledText className="text-gray-600 text-center mb-6 leading-6">
            We encountered an unexpected error. Don't worry, your data is safe.
          </StyledText>

          <StyledTouchableOpacity
            className="bg-primary-600 px-6 py-3 rounded-lg"
            onPress={this.handleRetry}
          >
            <StyledText className="text-white font-medium text-center">
              Try Again
            </StyledText>
          </StyledTouchableOpacity>

          {__DEV__ && this.state.error && (
            <StyledView className="mt-6 p-4 bg-red-50 rounded-lg w-full">
              <StyledText className="text-red-800 text-sm font-mono">
                {this.state.error.toString()}
              </StyledText>
            </StyledView>
          )}
        </StyledView>
      );
    }

    return this.props.children;
  }
}

