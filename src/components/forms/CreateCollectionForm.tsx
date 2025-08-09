import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { styled } from 'nativewind';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { collectionsApi } from '@/services/api/collections';
import { useCollectionStore } from '@/stores/collectionStore';
import { useAuthStore } from '@/stores/authStore';
import { CreateCollectionData } from '@/types';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledImage = styled(Image);

interface CreateCollectionFormData extends CreateCollectionData {
  coverPhoto?: string;
}

const categories = [
  'Comics',
  'Trading Cards',
  'Action Figures',
  'Books',
  'Coins',
  'Stamps',
  'Vinyl Records',
  'Art',
  'Antiques',
  'Other'
];

interface CreateCollectionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CreateCollectionForm: React.FC<CreateCollectionFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const queryClient = useQueryClient();
  const { addCollection } = useCollectionStore();
  const { user } = useAuthStore();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<CreateCollectionFormData>({
    defaultValues: {
      name: '',
      description: '',
      category: '',
      privacy: 'private',
    },
    mode: 'onChange',
  });

  const privacy = watch('privacy');

  // Upload image to Cloudinary
  const uploadToCloudinary = async (imageUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'collection-cover.jpg',
    } as any);
    formData.append('upload_preset', 'collectors_app'); // Set this in your Cloudinary settings

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to upload image');
    }

    return data.secure_url;
  };

  // Create collection mutation
  const createCollectionMutation = useMutation({
    mutationFn: async (data: CreateCollectionFormData) => {
      let coverPhotoUrl = '';
      
      // Upload cover photo if selected
      if (coverPhoto) {
        setUploadingPhoto(true);
        try {
          coverPhotoUrl = await uploadToCloudinary(coverPhoto);
        } catch (error) {
          throw new Error('Failed to upload cover photo');
        } finally {
          setUploadingPhoto(false);
        }
      }

      // Create collection data
      const collectionData: CreateCollectionData = {
        name: data.name,
        description: data.description || undefined,
        category: data.category,
        privacy: data.privacy,
        // Add coverPhoto to the API if your backend supports it
        ...(coverPhotoUrl && { coverPhoto: coverPhotoUrl }),
      };

      const response = await collectionsApi.createCollection(collectionData);
      return response.data;
    },
    onSuccess: (newCollection) => {
      // Update local state
      addCollection(newCollection);
      
      // Invalidate and refetch collections
      queryClient.invalidateQueries({ queryKey: ['collections'] });
      
      // Show success message
      Alert.alert(
        'Success',
        'Collection created successfully!',
        [{ text: 'OK', onPress: onSuccess }]
      );
      
      // Reset form
      reset();
      setCoverPhoto(null);
    },
    onError: (error: Error) => {
      Alert.alert(
        'Error',
        error.message || 'Failed to create collection. Please try again.',
        [{ text: 'OK' }]
      );
    },
  });

  const handlePickImage = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCoverPhoto(result.assets[0].uri);
    }
  };

  const handleTakePhoto = async () => {
    // Request permission
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    // Take photo
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setCoverPhoto(result.assets[0].uri);
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Cover Photo',
      'Choose how you want to add a cover photo',
      [
        { text: 'Camera', onPress: handleTakePhoto },
        { text: 'Photo Library', onPress: handlePickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleCategorySelect = (category: string) => {
    setValue('category', category);
    setShowCategoryDropdown(false);
  };

  const onSubmit = (data: CreateCollectionFormData) => {
    createCollectionMutation.mutate(data);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <StyledView className="p-6">
        {/* Header */}
        <StyledView className="flex-row items-center justify-between mb-6">
          <StyledText className="text-2xl font-bold text-gray-900">
            Create Collection
          </StyledText>
          {onCancel && (
            <StyledTouchableOpacity onPress={onCancel}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </StyledTouchableOpacity>
          )}
        </StyledView>

        {/* Cover Photo Section */}
        <StyledView className="mb-6">
          <StyledText className="text-sm font-medium text-gray-700 mb-3">
            Cover Photo (Optional)
          </StyledText>
          
          {coverPhoto ? (
            <StyledView className="relative">
              <StyledImage
                source={{ uri: coverPhoto }}
                className="w-full h-40 rounded-lg bg-gray-200"
                resizeMode="cover"
              />
              <StyledTouchableOpacity
                className="absolute top-2 right-2 bg-black/50 rounded-full p-2"
                onPress={() => setCoverPhoto(null)}
              >
                <Ionicons name="close" size={16} color="#ffffff" />
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                className="absolute bottom-2 right-2 bg-black/50 rounded-full p-2"
                onPress={showImagePicker}
              >
                <Ionicons name="camera" size={16} color="#ffffff" />
              </StyledTouchableOpacity>
            </StyledView>
          ) : (
            <StyledTouchableOpacity
              className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center bg-gray-100"
              onPress={showImagePicker}
            >
              <Ionicons name="camera-outline" size={32} color="#9ca3af" />
              <StyledText className="text-gray-500 mt-2 text-center">
                Tap to add cover photo
              </StyledText>
            </StyledTouchableOpacity>
          )}
        </StyledView>

        {/* Collection Name */}
        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Collection name is required',
            minLength: {
              value: 2,
              message: 'Collection name must be at least 2 characters',
            },
            maxLength: {
              value: 50,
              message: 'Collection name must be less than 50 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Collection Name *"
              placeholder="Enter collection name"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              autoCapitalize="words"
            />
          )}
        />

        {/* Description */}
        <Controller
          control={control}
          name="description"
          rules={{
            maxLength: {
              value: 200,
              message: 'Description must be less than 200 characters',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Description (Optional)"
              placeholder="Describe your collection"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: 'top' }}
            />
          )}
        />

        {/* Category Dropdown */}
        <Controller
          control={control}
          name="category"
          rules={{
            required: 'Please select a category',
          }}
          render={({ field: { value } }) => (
            <StyledView className="mb-4">
              <StyledText className="text-sm font-medium text-gray-700 mb-2">
                Category *
              </StyledText>
              <StyledTouchableOpacity
                className={`border rounded-lg px-3 py-3 flex-row items-center justify-between ${
                  errors.category ? 'border-red-500' : 'border-gray-300'
                }`}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <StyledText className={value ? 'text-gray-900' : 'text-gray-500'}>
                  {value || 'Select a category'}
                </StyledText>
                <Ionicons
                  name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#6b7280"
                />
              </StyledTouchableOpacity>
              
              {showCategoryDropdown && (
                <StyledView className="mt-1 bg-white border border-gray-300 rounded-lg shadow-sm">
                  {categories.map((category) => (
                    <StyledTouchableOpacity
                      key={category}
                      className="px-3 py-3 border-b border-gray-100 last:border-b-0"
                      onPress={() => handleCategorySelect(category)}
                    >
                      <StyledText className="text-gray-900">{category}</StyledText>
                    </StyledTouchableOpacity>
                  ))}
                </StyledView>
              )}
              
              {errors.category && (
                <StyledText className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </StyledText>
              )}
            </StyledView>
          )}
        />

        {/* Privacy Toggle */}
        <StyledView className="mb-6">
          <StyledText className="text-sm font-medium text-gray-700 mb-3">
            Privacy
          </StyledText>
          <StyledView className="flex-row bg-gray-200 rounded-lg p-1">
            <Controller
              control={control}
              name="privacy"
              render={({ field: { onChange, value } }) => (
                <>
                  <StyledTouchableOpacity
                    className={`flex-1 py-2 px-4 rounded-md flex-row items-center justify-center ${
                      value === 'private' ? 'bg-white shadow-sm' : ''
                    }`}
                    onPress={() => onChange('private')}
                  >
                    <Ionicons
                      name="lock-closed"
                      size={16}
                      color={value === 'private' ? '#2563eb' : '#6b7280'}
                    />
                    <StyledText
                      className={`ml-2 font-medium ${
                        value === 'private' ? 'text-primary-600' : 'text-gray-600'
                      }`}
                    >
                      Private
                    </StyledText>
                  </StyledTouchableOpacity>
                  
                  <StyledTouchableOpacity
                    className={`flex-1 py-2 px-4 rounded-md flex-row items-center justify-center ${
                      value === 'public' ? 'bg-white shadow-sm' : ''
                    }`}
                    onPress={() => onChange('public')}
                  >
                    <Ionicons
                      name="globe"
                      size={16}
                      color={value === 'public' ? '#2563eb' : '#6b7280'}
                    />
                    <StyledText
                      className={`ml-2 font-medium ${
                        value === 'public' ? 'text-primary-600' : 'text-gray-600'
                      }`}
                    >
                      Public
                    </StyledText>
                  </StyledTouchableOpacity>
                </>
              )}
            />
          </StyledView>
          <StyledText className="text-xs text-gray-500 mt-1">
            {privacy === 'private' 
              ? 'Only you can see this collection' 
              : 'Anyone can discover and view this collection'
            }
          </StyledText>
        </StyledView>

        {/* Submit Button */}
        <Button
          title="Create Collection"
          onPress={handleSubmit(onSubmit)}
          loading={createCollectionMutation.isPending || uploadingPhoto}
          disabled={!isValid || createCollectionMutation.isPending || uploadingPhoto}
          fullWidth
        />

        {/* Cancel Button */}
        {onCancel && (
          <Button
            title="Cancel"
            variant="ghost"
            onPress={onCancel}
            fullWidth
            style={{ marginTop: 12 }}
          />
        )}
      </StyledView>
    </ScrollView>
  );
};