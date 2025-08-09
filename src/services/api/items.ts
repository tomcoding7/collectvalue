import { apiClient } from './client';
import { Item, CreateItemData, UpdateItemData, FilterOptions, PaginatedResponse } from '@/types';

export const itemsApi = {
  // Get all items with optional filtering
  async getItems(params?: FilterOptions & {
    page?: number;
    limit?: number;
    collectionId?: string;
  }): Promise<PaginatedResponse<Item>> {
    return apiClient.get<PaginatedResponse<Item>>('/items', params);
  },

  // Get a single item by ID
  async getItem(id: string): Promise<Item> {
    return apiClient.get<Item>(`/items/${id}`);
  },

  // Create a new item
  async createItem(data: CreateItemData): Promise<Item> {
    return apiClient.post<Item>('/items', data);
  },

  // Update an existing item
  async updateItem(id: string, data: UpdateItemData): Promise<Item> {
    return apiClient.put<Item>(`/items/${id}`, data);
  },

  // Delete an item
  async deleteItem(id: string): Promise<void> {
    return apiClient.delete<void>(`/items/${id}`);
  },

  // Upload photos for an item
  async uploadPhotos(itemId: string, photos: File[]): Promise<Item> {
    const formData = new FormData();
    photos.forEach((photo, index) => {
      formData.append('photos', photo);
    });
    
    return apiClient.upload<Item>(`/items/${itemId}/photos`, formData);
  },

  // Delete a photo
  async deletePhoto(itemId: string, photoId: string): Promise<void> {
    return apiClient.delete<void>(`/items/${itemId}/photos/${photoId}`);
  },

  // Set primary photo
  async setPrimaryPhoto(itemId: string, photoId: string): Promise<void> {
    return apiClient.put<void>(`/items/${itemId}/photos/${photoId}/primary`);
  },

  // Bulk import items
  async bulkImport(items: CreateItemData[]): Promise<Item[]> {
    return apiClient.post<Item[]>('/items/bulk-import', { items });
  },

  // Get items by collection
  async getItemsByCollection(collectionId: string, params?: FilterOptions): Promise<Item[]> {
    return apiClient.get<Item[]>(`/collections/${collectionId}/items`, params);
  },

  // Search items
  async searchItems(query: string, params?: FilterOptions): Promise<Item[]> {
    return apiClient.get<Item[]>('/items', { search: query, ...params });
  },

  // Get items by category
  async getItemsByCategory(category: string, params?: FilterOptions): Promise<Item[]> {
    return apiClient.get<Item[]>('/items', { category, ...params });
  },

  // Get items by condition
  async getItemsByCondition(condition: string, params?: FilterOptions): Promise<Item[]> {
    return apiClient.get<Item[]>('/items', { condition, ...params });
  },

  // Get items by price range
  async getItemsByPriceRange(minPrice: number, maxPrice: number, params?: FilterOptions): Promise<Item[]> {
    return apiClient.get<Item[]>('/items', { minPrice, maxPrice, ...params });
  },
}; 