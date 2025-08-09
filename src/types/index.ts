export interface User {
  id: string;
  email: string;
  username: string;
  ebayToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  category: string;
  privacy: 'private' | 'public';
  userId: string;
  user: User;
  items: Item[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  purchasePrice?: number;
  currentValue?: number;
  condition?: string;
  collectionId: string;
  collection: Collection;
  photos: Photo[];
  ebayListing?: EbayListing;
  createdAt: Date;
  updatedAt: Date;
}

export interface Photo {
  id: string;
  url: string;
  isPrimary: boolean;
  itemId: string;
  item: Item;
  createdAt: Date;
}

export interface EbayListing {
  id: string;
  listingId: string;
  title: string;
  price: number;
  status: string;
  watchers: number;
  itemId?: string;
  item?: Item;
  userId: string;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCollectionData {
  name: string;
  description?: string;
  category: string;
  privacy?: 'private' | 'public';
}

export interface UpdateCollectionData {
  name?: string;
  description?: string;
  category?: string;
  privacy?: 'private' | 'public';
}

export interface CreateItemData {
  name: string;
  description?: string;
  purchasePrice?: number;
  currentValue?: number;
  condition?: string;
  collectionId: string;
  photos?: File[];
}

export interface UpdateItemData {
  name?: string;
  description?: string;
  purchasePrice?: number;
  currentValue?: number;
  condition?: string;
  photos?: File[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface FilterOptions {
  search?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'date' | 'value' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export interface EbayAuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface EbayListingImport {
  listingId: string;
  collectionId: string;
  createNewCollection?: boolean;
  collectionName?: string;
}

export interface AnalyticsData {
  totalValue: number;
  totalItems: number;
  totalCollections: number;
  categoryBreakdown: {
    category: string;
    count: number;
    value: number;
  }[];
  recentActivity: {
    type: 'item_added' | 'item_updated' | 'collection_created' | 'ebay_imported';
    item?: Item;
    collection?: Collection;
    timestamp: Date;
  }[];
} 