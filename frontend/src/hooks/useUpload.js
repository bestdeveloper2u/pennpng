import { useState } from 'react';
import { uploadFile } from '../services/api';

export function useUpload({ onSuccess } = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (file) => {
    setError(null);
    if (!file) return;

    setIsLoading(true);
    try {
      const saved = await uploadFile(file);
      if (onSuccess) onSuccess(saved);
      return saved;
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return { handleUpload, isLoading, error };
}
