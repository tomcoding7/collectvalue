import { ApiResponse, PaginatedResponse } from '@/types';
import { mockCollections, mockItems, createMockPaginatedResponse, delay } from './mockData';

class MockApiClient {
  private isMockMode: boolean;

  constructor() {
    // Check if we're in development mode or if API URL is not set
    this.isMockMode = !process.env.EXPO_PUBLIC_API_URL || 
                     process.env.EXPO_PUBLIC_API_URL === 'http://localhost:3000/api' ||
                     process.env.NODE_ENV === 'test';
  }

  private async simulateNetworkDelay(): Promise<void> {
    await delay(Math.random() * 500 + 200); // 200-700ms delay
  }

  private createSuccessResponse<T>(data: T): ApiResponse<T> {
    return { data };
  }

  private createPaginatedResponse<T>(data: T[]): PaginatedResponse<T> {
    return createMockPaginatedResponse(data);
  }

  async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    if (!this.isMockMode) {
      throw new Error('Real API not implemented yet');
    }

    await this.simulateNetworkDelay();

    // Simulate network errors occasionally
    if (Math.random() < 0.05) { // 5% chance of error
      throw new Error('Mock network error');
    }

    switch (url) {
      case '/collections':
        const collections = this.filterCollections(params);
        return this.createSuccessResponse(this.createPaginatedResponse(collections)) as ApiResponse<T>;
      
      case '/items':
        const items = this.filterItems(params);
        return this.createSuccessResponse(this.createPaginatedResponse(items)) as ApiResponse<T>;
      
      default:
        if (url.startsWith('/collections/')) {
          const id = url.split('/')[2];
          const collection = mockCollections.find(c => c.id === id);
          if (!collection) {
            throw new Error('Collection not found');
          }
          return this.createSuccessResponse(collection) as ApiResponse<T>;
        }
        
        if (url.startsWith('/items/')) {
          const id = url.split('/')[2];
          const item = mockItems.find(i => i.id === id);
          if (!item) {
            throw new Error('Item not found');
          }
          return this.createSuccessResponse(item) as ApiResponse<T>;
        }

        throw new Error(`Mock endpoint not found: ${url}`);
    }
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    if (!this.isMockMode) {
      throw new Error('Real API not implemented yet');
    }

    await this.simulateNetworkDelay();

    switch (url) {
      case '/collections':
        const newCollection = {
          id: `collection-${Date.now()}`,
          name: data.name,
          description: data.description,
          category: data.category,
          privacy: data.privacy || 'private',
          userId: 'user-1',
          user: mockCollections[0].user,
          items: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return this.createSuccessResponse(newCollection) as ApiResponse<T>;
      
      case '/items':
        const newItem = {
          id: `item-${Date.now()}`,
          name: data.name,
          description: data.description,
          purchasePrice: data.purchasePrice,
          currentValue: data.currentValue,
          condition: data.condition,
          collectionId: data.collectionId,
          collection: mockCollections.find(c => c.id === data.collectionId),
          photos: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        return this.createSuccessResponse(newItem) as ApiResponse<T>;
      
      default:
        throw new Error(`Mock POST endpoint not found: ${url}`);
    }
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    if (!this.isMockMode) {
      throw new Error('Real API not implemented yet');
    }

    await this.simulateNetworkDelay();

    if (url.startsWith('/collections/')) {
      const id = url.split('/')[2];
      const collection = mockCollections.find(c => c.id === id);
      if (!collection) {
        throw new Error('Collection not found');
      }
      
      const updatedCollection = {
        ...collection,
        ...data,
        updatedAt: new Date(),
      };
      
      return this.createSuccessResponse(updatedCollection) as ApiResponse<T>;
    }

    throw new Error(`Mock PUT endpoint not found: ${url}`);
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    if (!this.isMockMode) {
      throw new Error('Real API not implemented yet');
    }

    await this.simulateNetworkDelay();

    // Simulate successful deletion
    return this.createSuccessResponse({} as T);
  }

  private filterCollections(params?: any): typeof mockCollections {
    let filtered = [...mockCollections];

    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(search) ||
        c.description?.toLowerCase().includes(search)
      );
    }

    if (params?.category) {
      filtered = filtered.filter(c => c.category === params.category);
    }

    return filtered;
  }

  private filterItems(params?: any): typeof mockItems {
    let filtered = [...mockItems];

    if (params?.search) {
      const search = params.search.toLowerCase();
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(search) ||
        i.description?.toLowerCase().includes(search)
      );
    }

    if (params?.category) {
      filtered = filtered.filter(i => i.collection.category === params.category);
    }

    return filtered;
  }
}

export const mockApiClient = new MockApiClient();

