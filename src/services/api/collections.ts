import { apiClient } from './client';
import { Collection, CreateCollectionData, UpdateCollectionData, PaginatedResponse } from '@/types';

export const collectionsApi = {
  // Get all collections for the current user
  async getCollections(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }): Promise<PaginatedResponse<Collection>> {
    return apiClient.get<PaginatedResponse<Collection>>('/collections', params);
  },

  // Get a single collection by ID
  async getCollection(id: string): Promise<Collection> {
    return apiClient.get<Collection>(`/collections/${id}`);
  },

  // Create a new collection
  async createCollection(data: CreateCollectionData): Promise<{ data: Collection }> {
    return apiClient.post<Collection>('/collections', data);
  },

  // Update an existing collection
  async updateCollection(id: string, data: UpdateCollectionData): Promise<Collection> {
    return apiClient.put<Collection>(`/collections/${id}`, data);
  },

  // Delete a collection
  async deleteCollection(id: string): Promise<void> {
    return apiClient.delete<void>(`/collections/${id}`);
  },

  // Get collections by category
  async getCollectionsByCategory(category: string): Promise<Collection[]> {
    return apiClient.get<Collection[]>('/collections', { category });
  },

  // Search collections
  async searchCollections(query: string): Promise<Collection[]> {
    return apiClient.get<Collection[]>('/collections', { search: query });
  },
}; 