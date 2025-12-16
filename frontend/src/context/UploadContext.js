import { createContext, useCallback, useEffect, useState } from 'react';
import { fetchFiles } from '../services/api';

export const UploadContext = createContext({ files: [], refresh: () => {} });

export function UploadProvider({ children, initialFiles = [] }) {
  const [files, setFiles] = useState(initialFiles);

  const refresh = useCallback(async () => {
    const latest = await fetchFiles();
    setFiles(latest);
  }, []);

  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  useEffect(() => {
    if (!initialFiles || initialFiles.length === 0) {
      refresh();
    }
  }, [initialFiles, refresh]);

  return (
    <UploadContext.Provider value={{ files, refresh }}>
      {children}
    </UploadContext.Provider>
  );
}
