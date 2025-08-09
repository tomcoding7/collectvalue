import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CreateCollectionForm } from '@/components/forms/CreateCollectionForm';

export default function CreateCollectionScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    // Navigate back to collections list
    router.back();
  };

  const handleCancel = () => {
    // Navigate back to collections list
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <CreateCollectionForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </SafeAreaView>
  );
}