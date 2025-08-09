import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { ItemCard } from '@/components/cards/ItemCard';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { itemsApi } from '@/services/api/items';
import { Item } from '@/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ItemsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterCondition, setFilterCondition] = useState<string>('');

  const { data: items, isLoading, error } = useQuery({
    queryKey: ['items', searchQuery, filterCategory, filterCondition],
    queryFn: () => itemsApi.getItems({
      search: searchQuery || undefined,
      category: filterCategory || undefined,
      condition: filterCondition || undefined,
    }),
  });

  const filteredItems = items?.data || [];

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard
      item={item}
      variant={viewMode}
      size={viewMode === 'grid' ? 'md' : 'lg'}
      onPress={() => {
        // Navigate to item detail
        console.log('Navigate to item:', item.id);
      }}
      onEdit={() => {
        // Navigate to edit item
        console.log('Edit item:', item.id);
      }}
      onDelete={() => {
        // Show delete confirmation
        console.log('Delete item:', item.id);
      }}
    />
  );

  const renderHeader = () => (
    <StyledView className="px-4 pb-4">
      <StyledView className="flex-row items-center justify-between mb-4">
        <StyledText className="text-2xl font-bold text-gray-900">
          Items
        </StyledText>
        <StyledTouchableOpacity
          className="bg-primary-600 p-3 rounded-full"
          onPress={() => {
            // Navigate to create item
            console.log('Create new item');
          }}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </StyledTouchableOpacity>
      </StyledView>

      {/* Search Bar */}
      <StyledView className="relative mb-4">
        <StyledTextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 pl-12 text-base"
          placeholder="Search items..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons
          name="search"
          size={20}
          color="#6b7280"
          style={{ position: 'absolute', left: 12, top: 12 }}
        />
      </StyledView>

      {/* View Mode Toggle */}
      <StyledView className="flex-row items-center justify-between mb-4">
        <StyledView className="flex-row bg-gray-200 rounded-lg p-1">
          <StyledTouchableOpacity
            className={`px-3 py-2 rounded-md ${
              viewMode === 'grid' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons
              name="grid-outline"
              size={20}
              color={viewMode === 'grid' ? '#2563eb' : '#6b7280'}
            />
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            className={`px-3 py-2 rounded-md ${
              viewMode === 'list' ? 'bg-white shadow-sm' : ''
            }`}
            onPress={() => setViewMode('list')}
          >
            <Ionicons
              name="list-outline"
              size={20}
              color={viewMode === 'list' ? '#2563eb' : '#6b7280'}
            />
          </StyledTouchableOpacity>
        </StyledView>

        <StyledText className="text-sm text-gray-600">
          {filteredItems.length} items
        </StyledText>
      </StyledView>

      {/* Filters */}
      <StyledView className="flex-row mb-4">
        <StyledTouchableOpacity
          className={`px-3 py-2 rounded-full mr-2 ${
            filterCategory === '' ? 'bg-primary-600' : 'bg-gray-200'
          }`}
          onPress={() => setFilterCategory('')}
        >
          <StyledText
            className={`text-sm font-medium ${
              filterCategory === '' ? 'text-white' : 'text-gray-700'
            }`}
          >
            All
          </StyledText>
        </StyledTouchableOpacity>
        {['Comics', 'Cards', 'Figures', 'Books', 'Other'].map((category) => (
          <StyledTouchableOpacity
            key={category}
            className={`px-3 py-2 rounded-full mr-2 ${
              filterCategory === category ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            onPress={() => setFilterCategory(category)}
          >
            <StyledText
              className={`text-sm font-medium ${
                filterCategory === category ? 'text-white' : 'text-gray-700'
              }`}
            >
              {category}
            </StyledText>
          </StyledTouchableOpacity>
        ))}
      </StyledView>

      {/* Condition Filter */}
      <StyledView className="flex-row mb-4">
        <StyledTouchableOpacity
          className={`px-3 py-2 rounded-full mr-2 ${
            filterCondition === '' ? 'bg-primary-600' : 'bg-gray-200'
          }`}
          onPress={() => setFilterCondition('')}
        >
          <StyledText
            className={`text-sm font-medium ${
              filterCondition === '' ? 'text-white' : 'text-gray-700'
            }`}
          >
            Any Condition
          </StyledText>
        </StyledTouchableOpacity>
        {['Mint', 'Near Mint', 'Excellent', 'Good', 'Fair', 'Poor'].map((condition) => (
          <StyledTouchableOpacity
            key={condition}
            className={`px-3 py-2 rounded-full mr-2 ${
              filterCondition === condition ? 'bg-primary-600' : 'bg-gray-200'
            }`}
            onPress={() => setFilterCondition(condition)}
          >
            <StyledText
              className={`text-sm font-medium ${
                filterCondition === condition ? 'text-white' : 'text-gray-700'
              }`}
            >
              {condition}
            </StyledText>
          </StyledTouchableOpacity>
        ))}
      </StyledView>
    </StyledView>
  );

  const renderEmpty = () => (
    <EmptyState
      icon="cube-outline"
      title="No items yet"
      description="Add your first item to start building your collection"
      actionText="Add Item"
      onAction={() => {
        // Navigate to create item
        console.log('Create new item');
      }}
    />
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StyledView className="flex-1 items-center justify-center">
          <StyledText className="text-gray-600">Loading items...</StyledText>
        </StyledView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <EmptyState
          icon="alert-circle-outline"
          title="Something went wrong"
          description="We couldn't load your items. Please try again."
          actionText="Try Again"
          onAction={() => {
            // Retry query
            console.log('Retry loading items');
          }}
          iconColor="#ef4444"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={viewMode === 'grid' ? 2 : 1}
        columnWrapperStyle={
          viewMode === 'grid' 
            ? { paddingHorizontal: 16, gap: 12 }
            : undefined
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
} 