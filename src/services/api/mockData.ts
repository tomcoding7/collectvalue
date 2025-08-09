import { Collection, Item, User, PaginatedResponse } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  email: 'test@example.com',
  username: 'testuser',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockCollections: Collection[] = [
  {
    id: 'collection-1',
    name: 'Marvel Comics',
    description: 'My collection of Marvel comic books',
    category: 'Comics',
    privacy: 'private',
    userId: 'user-1',
    user: mockUser,
    items: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'collection-2',
    name: 'Pokemon Cards',
    description: 'Rare Pokemon card collection',
    category: 'Cards',
    privacy: 'public',
    userId: 'user-1',
    user: mockUser,
    items: [],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: 'collection-3',
    name: 'Action Figures',
    description: 'Star Wars and Marvel action figures',
    category: 'Figures',
    privacy: 'private',
    userId: 'user-1',
    user: mockUser,
    items: [],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
];

export const mockItems: Item[] = [
  {
    id: 'item-1',
    name: 'Spider-Man #1',
    description: 'First appearance of Spider-Man',
    purchasePrice: 500,
    currentValue: 1200,
    condition: 'Mint',
    collectionId: 'collection-1',
    collection: mockCollections[0],
    photos: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'item-2',
    name: 'Charizard Holo',
    description: 'First edition Charizard holographic card',
    purchasePrice: 200,
    currentValue: 800,
    condition: 'Near Mint',
    collectionId: 'collection-2',
    collection: mockCollections[1],
    photos: [],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

export const createMockPaginatedResponse = <T>(
  data: T[],
  page: number = 1,
  limit: number = 10,
  total: number = data.length
): PaginatedResponse<T> => ({
  data,
  pagination: {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  },
});

export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

