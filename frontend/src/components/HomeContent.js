import { useContext } from 'react';
import UploadForm from './UploadForm';
import { UploadContext } from '../context/UploadContext';

function HomeContent() {
  const { files, refresh } = useContext(UploadContext);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <UploadForm onUploaded={refresh} />

      <section style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
        <h2 style={{ marginTop: 0 }}>Uploaded files</h2>
        {files.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No files uploaded yet.</p>
        ) : (
          <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0 }}>
            {files.map((file) => (
              <li key={file.id} style={{ padding: '8px 0', borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ fontWeight: 600 }}>{file.original_name}</div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>
                  {file.mimetype} • {(file.size / 1024).toFixed(1)} KB
                </div>
                <a href={file.url} style={{ fontSize: 12 }}>Download</a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default HomeContent;
