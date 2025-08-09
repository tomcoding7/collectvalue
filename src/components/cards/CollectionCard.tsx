import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Collection } from '@/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

interface CollectionCardProps {
  collection: Collection;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onPress,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const previewItems = collection.items.slice(0, 4);
  const totalValue = collection.items.reduce((sum, item) => sum + (item.currentValue || 0), 0);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getPrivacyIcon = () => {
    return collection.privacy === 'private' ? 'lock-closed' : 'globe';
  };

  const getPrivacyColor = () => {
    return collection.privacy === 'private' ? 'text-gray-500' : 'text-blue-500';
  };

  return (
    <StyledTouchableOpacity
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <StyledView className="flex-row items-start justify-between mb-3">
        <StyledView className="flex-1">
          <StyledView className="flex-row items-center mb-1">
            <StyledText className="text-lg font-semibold text-gray-900 mr-2">
              {collection.name}
            </StyledText>
            <Ionicons 
              name={getPrivacyIcon()} 
              size={16} 
              color={collection.privacy === 'private' ? '#6B7280' : '#3B82F6'} 
            />
          </StyledView>
          
          {collection.description && (
            <StyledText className="text-gray-600 text-sm" numberOfLines={2}>
              {collection.description}
            </StyledText>
          )}
        </StyledView>
        
        {showActions && (
          <StyledView className="flex-row">
            {onEdit && (
              <StyledTouchableOpacity
                className="bg-gray-100 rounded-full p-2 mr-2"
                onPress={onEdit}
              >
                <Ionicons name="pencil" size={16} color="#374151" />
              </StyledTouchableOpacity>
            )}
            {onDelete && (
              <StyledTouchableOpacity
                className="bg-gray-100 rounded-full p-2"
                onPress={onDelete}
              >
                <Ionicons name="trash" size={16} color="#EF4444" />
              </StyledTouchableOpacity>
            )}
          </StyledView>
        )}
      </StyledView>

      {/* Preview Images */}
      {previewItems.length > 0 && (
        <StyledView className="flex-row mb-3">
          {previewItems.map((item, index) => {
            const primaryPhoto = item.photos.find(photo => photo.isPrimary) || item.photos[0];
            return (
              <StyledView 
                key={item.id}
                className={`rounded-md overflow-hidden ${
                  index === 0 ? 'w-16 h-16' : 'w-12 h-12 -ml-2'
                }`}
                style={{ zIndex: previewItems.length - index }}
              >
                <StyledImage
                  source={{ uri: primaryPhoto?.url || 'https://via.placeholder.com/150' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </StyledView>
            );
          })}
          {collection.items.length > 4 && (
            <StyledView className="w-12 h-12 -ml-2 bg-gray-200 rounded-md items-center justify-center">
              <StyledText className="text-xs font-medium text-gray-600">
                +{collection.items.length - 4}
              </StyledText>
            </StyledView>
          )}
        </StyledView>
      )}

      {/* Stats */}
      <StyledView className="flex-row items-center justify-between">
        <StyledView className="flex-row items-center">
          <Ionicons name="cube-outline" size={16} color="#6B7280" />
          <StyledText className="text-sm text-gray-600 ml-1">
            {collection.items.length} {collection.items.length === 1 ? 'item' : 'items'}
          </StyledText>
        </StyledView>
        
        <StyledView className="flex-row items-center">
          <Ionicons name="trending-up-outline" size={16} color="#10B981" />
          <StyledText className="text-sm font-medium text-gray-900 ml-1">
            {formatPrice(totalValue)}
          </StyledText>
        </StyledView>
      </StyledView>

      {/* Category Badge */}
      <StyledView className="mt-3">
        <StyledView className="bg-primary-100 px-2 py-1 rounded-full self-start">
          <StyledText className="text-xs font-medium text-primary-700">
            {collection.category}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledTouchableOpacity>
  );
}; 