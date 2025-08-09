import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { Item } from '@/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

interface ItemCardProps {
  item: Item;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'grid' | 'list';
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  size = 'md',
  variant = 'grid',
  onPress,
  onEdit,
  onDelete,
  showActions = true,
}) => {
  const primaryPhoto = item.photos.find(photo => photo.isPrimary) || item.photos[0];
  
  const getContainerClasses = () => {
    const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200';
    const sizeClasses = {
      sm: 'p-2',
      md: 'p-3',
      lg: 'p-4',
    };
    const variantClasses = {
      grid: 'flex-1',
      list: 'flex-row',
    };
    
    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]}`;
  };

  const getImageClasses = () => {
    const baseClasses = 'rounded-md bg-gray-100';
    const sizeClasses = {
      sm: 'w-16 h-16',
      md: 'w-20 h-20',
      lg: 'w-24 h-24',
    };
    const variantClasses = {
      grid: 'w-full aspect-square',
      list: sizeClasses[size],
    };
    
    return `${baseClasses} ${variantClasses[variant]}`;
  };

  const getContentClasses = () => {
    const baseClasses = 'flex-1';
    const variantClasses = {
      grid: 'mt-2',
      list: 'ml-3',
    };
    
    return `${baseClasses} ${variantClasses[variant]}`;
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getConditionColor = (condition?: string) => {
    switch (condition?.toLowerCase()) {
      case 'mint':
        return 'text-green-600';
      case 'near mint':
        return 'text-green-500';
      case 'excellent':
        return 'text-blue-600';
      case 'good':
        return 'text-yellow-600';
      case 'fair':
        return 'text-orange-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <StyledTouchableOpacity
      className={getContainerClasses()}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <StyledView className="relative">
        <StyledImage
          source={{ uri: primaryPhoto?.url || 'https://via.placeholder.com/150' }}
          className={getImageClasses()}
          resizeMode="cover"
        />
        
        {item.ebayListing && (
          <StyledView className="absolute top-1 left-1 bg-yellow-500 px-1 py-0.5 rounded">
            <StyledText className="text-xs text-white font-medium">
              eBay
            </StyledText>
          </StyledView>
        )}
        
        {showActions && (
          <StyledView className="absolute top-1 right-1 flex-row">
            {onEdit && (
              <StyledTouchableOpacity
                className="bg-white/90 rounded-full p-1 mr-1"
                onPress={onEdit}
              >
                <Ionicons name="pencil" size={12} color="#374151" />
              </StyledTouchableOpacity>
            )}
            {onDelete && (
              <StyledTouchableOpacity
                className="bg-white/90 rounded-full p-1"
                onPress={onDelete}
              >
                <Ionicons name="trash" size={12} color="#EF4444" />
              </StyledTouchableOpacity>
            )}
          </StyledView>
        )}
      </StyledView>

      <StyledView className={getContentClasses()}>
        <StyledText 
          className={`font-medium text-gray-900 ${
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base'
          }`}
          numberOfLines={variant === 'grid' ? 2 : 1}
        >
          {item.name}
        </StyledText>
        
        {item.description && (
          <StyledText 
            className="text-gray-500 text-sm mt-1"
            numberOfLines={variant === 'grid' ? 2 : 1}
          >
            {item.description}
          </StyledText>
        )}
        
        <StyledView className="flex-row items-center justify-between mt-2">
          <StyledView className="flex-row items-center">
            <StyledText className="text-sm font-medium text-gray-900">
              {formatPrice(item.currentValue)}
            </StyledText>
            {item.purchasePrice && item.currentValue && (
              <StyledText 
                className={`text-xs ml-2 ${
                  item.currentValue >= item.purchasePrice ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {item.currentValue >= item.purchasePrice ? '+' : ''}
                {formatPrice(item.currentValue - item.purchasePrice)}
              </StyledText>
            )}
          </StyledView>
          
          {item.condition && (
            <StyledText className={`text-xs ${getConditionColor(item.condition)}`}>
              {item.condition}
            </StyledText>
          )}
        </StyledView>
        
        {variant === 'list' && item.collection && (
          <StyledText className="text-xs text-gray-500 mt-1">
            {item.collection.name}
          </StyledText>
        )}
      </StyledView>
    </StyledTouchableOpacity>
  );
}; 