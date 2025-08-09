import { create } from 'zustand';
import { Collection, CreateCollectionData, UpdateCollectionData } from '@/types';

interface CollectionState {
  collections: Collection[];
  currentCollection: Collection | null;
  isLoading: boolean;
  error: string | null;
  setCollections: (collections: Collection[]) => void;
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: UpdateCollectionData) => void;
  removeCollection: (id: string) => void;
  setCurrentCollection: (collection: Collection | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCollectionStore = create<CollectionState>((set, get) => ({
  collections: [],
  currentCollection: null,
  isLoading: false,
  error: null,
  setCollections: (collections) => set({ collections }),
  addCollection: (collection) => set((state) => ({
    collections: [...state.collections, collection]
  })),
  updateCollection: (id, updates) => set((state) => ({
    collections: state.collections.map(collection =>
      collection.id === id ? { ...collection, ...updates } : collection
    ),
    currentCollection: state.currentCollection?.id === id 
      ? { ...state.currentCollection, ...updates }
      : state.currentCollection
  })),
  removeCollection: (id) => set((state) => ({
    collections: state.collections.filter(collection => collection.id !== id),
    currentCollection: state.currentCollection?.id === id ? null : state.currentCollection
  })),
  setCurrentCollection: (collection) => set({ currentCollection: collection }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
})); 