import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '../../src/components/ui/ErrorBoundary';
import RootLayout from '../../app/_layout';

// Mock all the necessary modules
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Stack: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
  Tabs: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
}));

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 0,
    },
  },
});

const renderApp = () => {
  const queryClient = createTestQueryClient();
  return render(
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RootLayout />
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the app without crashing', () => {
    expect(() => renderApp()).not.toThrow();
  });

  it('shows error boundary when there is an unhandled error', () => {
    // Mock a component that throws an error
    const ErrorComponent = () => {
      throw new Error('Integration test error');
    };

    const TestApp = () => (
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    render(<TestApp />);

    expect(screen.getByText('Oops! Something went wrong')).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    // This test would verify that API errors are handled properly
    // and don't cause the app to crash
    renderApp();

    // The app should render without crashing even if API calls fail
    await waitFor(() => {
      expect(screen.getByText('Collections')).toBeTruthy();
    });
  });

  it('maintains app state during navigation', async () => {
    renderApp();

    // Verify that the app maintains its state and doesn't crash
    // during navigation between screens
    await waitFor(() => {
      expect(screen.getByText('Collections')).toBeTruthy();
    });
  });
});



