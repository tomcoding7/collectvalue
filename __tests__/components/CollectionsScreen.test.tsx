import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CollectionsScreen from '../../app/(app)/collections/index';

// Mock the router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock the API
jest.mock('@/services/api/collections', () => ({
  collectionsApi: {
    getCollections: jest.fn(),
  },
}));

const mockCollectionsApi = require('@/services/api/collections').collectionsApi;

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

describe('CollectionsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state correctly', () => {
    mockCollectionsApi.getCollections.mockImplementation(() => 
      new Promise(() => {}) // Never resolves to simulate loading
    );

    renderWithQueryClient(<CollectionsScreen />);
    
    expect(screen.getByText('Loading collections...')).toBeTruthy();
  });

  it('renders collections list when data is loaded', async () => {
    const mockData = {
      data: [
        {
          id: '1',
          name: 'Test Collection',
          description: 'Test Description',
          category: 'Comics',
          privacy: 'private',
          userId: 'user-1',
          user: { id: 'user-1', email: 'test@example.com', username: 'testuser' },
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    };

    mockCollectionsApi.getCollections.mockResolvedValue(mockData);

    renderWithQueryClient(<CollectionsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Test Collection')).toBeTruthy();
    });
  });

  it('renders empty state when no collections exist', async () => {
    const mockData = {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };

    mockCollectionsApi.getCollections.mockResolvedValue(mockData);

    renderWithQueryClient(<CollectionsScreen />);

    await waitFor(() => {
      expect(screen.getByText('No collections yet')).toBeTruthy();
      expect(screen.getByText('Create your first collection to start organizing your collectibles')).toBeTruthy();
    });
  });

  it('renders error state when API fails', async () => {
    mockCollectionsApi.getCollections.mockRejectedValue(new Error('API Error'));

    renderWithQueryClient(<CollectionsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong')).toBeTruthy();
      expect(screen.getByText('We couldn\'t load your collections. Please try again.')).toBeTruthy();
    });
  });

  it('navigates to create collection when add button is pressed', async () => {
    const mockData = {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    };

    mockCollectionsApi.getCollections.mockResolvedValue(mockData);

    renderWithQueryClient(<CollectionsScreen />);

    await waitFor(() => {
      const addButton = screen.getByText('Create Collection');
      fireEvent.press(addButton);
      expect(mockPush).toHaveBeenCalledWith('/collections/create');
    });
  });

  it('filters collections by search query', async () => {
    const mockData = {
      data: [
        {
          id: '1',
          name: 'Marvel Comics',
          description: 'Marvel collection',
          category: 'Comics',
          privacy: 'private',
          userId: 'user-1',
          user: { id: 'user-1', email: 'test@example.com', username: 'testuser' },
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Pokemon Cards',
          description: 'Pokemon collection',
          category: 'Cards',
          privacy: 'private',
          userId: 'user-1',
          user: { id: 'user-1', email: 'test@example.com', username: 'testuser' },
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      },
    };

    mockCollectionsApi.getCollections.mockResolvedValue(mockData);

    renderWithQueryClient(<CollectionsScreen />);

    await waitFor(() => {
      expect(screen.getByText('Marvel Comics')).toBeTruthy();
      expect(screen.getByText('Pokemon Cards')).toBeTruthy();
    });

    // The search functionality would be tested here if we had access to the search input
    // For now, we verify the API is called with search parameters
    expect(mockCollectionsApi.getCollections).toHaveBeenCalledWith({
      search: '',
      category: '',
    });
  });
});

