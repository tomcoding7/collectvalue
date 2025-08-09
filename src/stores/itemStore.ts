import { create } from 'zustand';
import { Item, CreateItemData, UpdateItemData, FilterOptions } from '@/types';

interface ItemState {
  items: Item[];
  filteredItems: Item[];
  currentItem: Item | null;
  isLoading: boolean;
  error: string | null;
  filters: FilterOptions;
  setItems: (items: Item[]) => void;
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: UpdateItemData) => void;
  removeItem: (id: string) => void;
  setCurrentItem: (item: Item | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: FilterOptions) => void;
  clearFilters: () => void;
  applyFilters: () => void;
}

export const useItemStore = create<ItemState>((set, get) => ({
  items: [],
  filteredItems: [],
  currentItem: null,
  isLoading: false,
  error: null,
  filters: {},
  setItems: (items) => set({ items, filteredItems: items }),
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
    filteredItems: [...state.filteredItems, item]
  })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ),
    filteredItems: state.filteredItems.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ),
    currentItem: state.currentItem?.id === id 
      ? { ...state.currentItem, ...updates }
      : state.currentItem
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id),
    filteredItems: state.filteredItems.filter(item => item.id !== id),
    currentItem: state.currentItem?.id === id ? null : state.currentItem
  })),
  setCurrentItem: (item) => set({ currentItem: item }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) => set({ filters }),
  clearFilters: () => set({ filters: {} }),
  applyFilters: () => {
    const { items, filters } = get();
    let filtered = [...items];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.collection.category === filters.category);
    }

    if (filters.condition) {
      filtered = filtered.filter(item => item.condition === filters.condition);
    }

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(item => 
        (item.currentValue || 0) >= filters.minPrice!
      );
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(item => 
        (item.currentValue || 0) <= filters.maxPrice!
      );
    }

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filters.sortBy) {
          case 'name':
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case 'date':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'value':
            aValue = a.currentValue || 0;
            bValue = b.currentValue || 0;
            break;
          case 'price':
            aValue = a.purchasePrice || 0;
            bValue = b.purchasePrice || 0;
            break;
          default:
            return 0;
        }

        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    set({ filteredItems: filtered });
  },
})); 