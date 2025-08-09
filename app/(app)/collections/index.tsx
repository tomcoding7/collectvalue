import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { CollectionCard } from '@/components/cards/CollectionCard';
import { Button } from '@/components/ui/Button';
import { collectionsApi } from '@/services/api/collections';
import { Collection } from '@/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function CollectionsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');

  const { data: collections, isLoading, error } = useQuery({
    queryKey: ['collections', searchQuery, filterCategory],
    queryFn: () => collectionsApi.getCollections({
      search: searchQuery || undefined,
      category: filterCategory || undefined,
    }),
  });

  const filteredCollections = collections?.data || [];

  const renderCollection = ({ item }: { item: Collection }) => (
    <CollectionCard
      collection={item}
      onPress={() => {
        // Navigate to collection detail
        router.push(`/collections/${item.id}`);
      }}
      onEdit={() => {
        // Navigate to edit collection
        router.push(`/collections/${item.id}/edit`);
      }}
      onDelete={() => {
        // Show delete confirmation
        console.log('Delete collection:', item.id);
      }}
    />
  );

  const renderHeader = () => (
    <StyledView className="px-4 pb-4">
      <StyledView className="flex-row items-center justify-between mb-4">
        <StyledText className="text-2xl font-bold text-gray-900">
          Collections
        </StyledText>
        <StyledTouchableOpacity
          className="bg-primary-600 p-3 rounded-full"
          onPress={() => {
            // Navigate to create collection
            router.push('/collections/create');
          }}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </StyledTouchableOpacity>
      </StyledView>

      {/* Search Bar */}
      <StyledView className="relative mb-4">
        <StyledTextInput
          className="bg-white border border-gray-300 rounded-lg px-4 py-3 pl-12 text-base"
          placeholder="Search collections..."
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

      {/* Category Filter */}
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
    </StyledView>
  );

  const renderEmpty = () => (
    <StyledView className="flex-1 items-center justify-center px-8">
      <Ionicons name="folder-outline" size={64} color="#9ca3af" />
      <StyledText className="text-xl font-semibold text-gray-900 mt-4 mb-2">
        No collections yet
      </StyledText>
      <StyledText className="text-gray-600 text-center mb-6">
        Create your first collection to start organizing your collectibles
      </StyledText>
      <Button
        title="Create Collection"
        onPress={() => {
          // Navigate to create collection
          router.push('/collections/create');
        }}
        fullWidth
      />
    </StyledView>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StyledView className="flex-1 items-center justify-center">
          <StyledText className="text-gray-600">Loading collections...</StyledText>
        </StyledView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StyledView className="flex-1 items-center justify-center px-8">
          <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
          <StyledText className="text-xl font-semibold text-gray-900 mt-4 mb-2">
            Something went wrong
          </StyledText>
          <StyledText className="text-gray-600 text-center mb-6">
            We couldn't load your collections. Please try again.
          </StyledText>
          <Button
            title="Try Again"
            onPress={() => {
              // Retry query
              console.log('Retry loading collections');
            }}
          />
        </StyledView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <FlatList
        data={filteredCollections}
        renderItem={renderCollection}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ paddingHorizontal: 16, gap: 12 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}