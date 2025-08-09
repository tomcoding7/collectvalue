import { apiClient } from './client';
import { EbayListing, EbayListingImport, EbayAuthResponse } from '@/types';

export const ebayApi = {
  // Initialize eBay OAuth flow
  async initiateAuth(): Promise<{ authUrl: string }> {
    return apiClient.get<{ authUrl: string }>('/ebay/auth');
  },

  // Complete OAuth flow with authorization code
  async completeAuth(code: string): Promise<EbayAuthResponse> {
    return apiClient.post<EbayAuthResponse>('/ebay/auth/callback', { code });
  },

  // Refresh eBay access token
  async refreshToken(refreshToken: string): Promise<EbayAuthResponse> {
    return apiClient.post<EbayAuthResponse>('/ebay/auth/refresh', { refreshToken });
  },

  // Get user's eBay listings
  async getListings(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<EbayListing[]> {
    return apiClient.get<EbayListing[]>('/ebay/listings', params);
  },

  // Get a specific eBay listing
  async getListing(listingId: string): Promise<EbayListing> {
    return apiClient.get<EbayListing>(`/ebay/listings/${listingId}`);
  },

  // Import selected eBay listings
  async importListings(imports: EbayListingImport[]): Promise<EbayListing[]> {
    return apiClient.post<EbayListing[]>('/ebay/import', { imports });
  },

  // Sync eBay listing updates
  async syncListings(): Promise<{ updated: number; errors: string[] }> {
    return apiClient.post<{ updated: number; errors: string[] }>('/ebay/sync');
  },

  // Get eBay listing details (price, watchers, etc.)
  async getListingDetails(listingId: string): Promise<{
    price: number;
    watchers: number;
    status: string;
    endTime: string;
  }> {
    return apiClient.get<{
      price: number;
      watchers: number;
      status: string;
      endTime: string;
    }>(`/ebay/listings/${listingId}/details`);
  },

  // Search eBay listings
  async searchListings(query: string, params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    condition?: string;
  }): Promise<EbayListing[]> {
    return apiClient.get<EbayListing[]>('/ebay/search', { query, ...params });
  },

  // Get eBay categories
  async getCategories(): Promise<{
    id: string;
    name: string;
    parentId?: string;
  }[]> {
    return apiClient.get<{
      id: string;
      name: string;
      parentId?: string;
    }[]>('/ebay/categories');
  },

  // Disconnect eBay account
  async disconnectAccount(): Promise<void> {
    return apiClient.delete<void>('/ebay/auth');
  },

  // Get eBay account status
  async getAccountStatus(): Promise<{
    connected: boolean;
    username?: string;
    lastSync?: string;
  }> {
    return apiClient.get<{
      connected: boolean;
      username?: string;
      lastSync?: string;
    }>('/ebay/status');
  },
}; 