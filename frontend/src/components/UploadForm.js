import { useRef } from 'react';
import { useUpload } from '../hooks/useUpload';

function UploadForm({ onUploaded }) {
  const inputRef = useRef(null);
  const { handleUpload, isLoading, error } = useUpload({ onSuccess: onUploaded });

  const onSubmit = async (event) => {
    event.preventDefault();
    const file = inputRef.current?.files?.[0];
    await handleUpload(file);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>Upload a file</label>
      <input ref={inputRef} type="file" name="file" style={{ marginBottom: 12 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="submit" disabled={isLoading} style={{ padding: '8px 14px', border: 'none', borderRadius: 8, background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
          {isLoading ? 'Uploading…' : 'Upload'}
        </button>
        {error && <span style={{ color: '#b91c1c' }}>{error}</span>}
      </div>
    </form>
  );
}

export default UploadForm;
