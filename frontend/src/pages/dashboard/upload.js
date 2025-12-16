import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { uploadImage, getCategories } from '../../services/api';
import { Upload, X, Plus } from 'lucide-react';

export default function UploadPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const fileInputRef = useRef(null);
  
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    subcategoryId: '',
    keywords: []
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [keywordInput, setKeywordInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user/login');
      return;
    }
    
    fetchCategories();
  }, [isAuthenticated, authLoading]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.categories || data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const addKeyword = () => {
    const keyword = keywordInput.trim().toLowerCase();
    if (keyword && !formData.keywords.includes(keyword)) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keyword]
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Please select an image');
      return;
    }

    if (!formData.title.trim()) {
      setError('Please enter a title');
      return;
    }

    setUploading(true);

    try {
      const data = new FormData();
      data.append('image', selectedFile);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('categoryId', formData.categoryId);
      data.append('subcategoryId', formData.subcategoryId);
      data.append('keywords', formData.keywords.join(','));

      await uploadImage(data);
      
      setSuccess('Image uploaded successfully! It will be reviewed shortly.');
      setSelectedFile(null);
      setPreview(null);
      setFormData({
        title: '',
        description: '',
        categoryId: '',
        subcategoryId: '',
        keywords: []
      });
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Upload Image - PNGPoint</title>
      </Head>

      <div style={styles.container}>
        <h1 style={styles.title}>Upload Image</h1>

        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.uploadSection}>
            <div
              style={styles.dropzone}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {preview ? (
                <div style={styles.previewContainer}>
                  <img src={preview} alt="Preview" style={styles.preview} />
                  <button
                    type="button"
                    style={styles.removeBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreview(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div style={styles.dropzoneContent}>
                  <Upload size={48} color="#999" />
                  <p style={styles.dropzoneText}>Click or drag image here to upload</p>
                  <p style={styles.dropzoneHint}>PNG, JPG, WEBP up to 50MB</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>

          <div style={styles.formSection}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={styles.input}
                placeholder="Enter image title"
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={styles.textarea}
                placeholder="Describe your image..."
                rows={4}
              />
            </div>

            <div style={styles.row}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Category</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: '' })}
                  style={styles.select}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Keywords</label>
              <div style={styles.keywordInput}>
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  style={styles.input}
                  placeholder="Type keyword and press Enter"
                />
                <button type="button" onClick={addKeyword} style={styles.addKeywordBtn}>
                  <Plus size={20} />
                </button>
              </div>
              <div style={styles.keywords}>
                {formData.keywords.map((keyword, index) => (
                  <span key={index} style={styles.keyword}>
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      style={styles.removeKeywordBtn}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button type="submit" style={styles.submitBtn} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  },
  container: {
    maxWidth: '800px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#333'
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  success: {
    background: '#d1fae5',
    color: '#059669',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  form: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  uploadSection: {
    marginBottom: '24px'
  },
  dropzone: {
    border: '2px dashed #ddd',
    borderRadius: '12px',
    padding: '40px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
    background: '#fafafa'
  },
  dropzoneContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  },
  dropzoneText: {
    fontSize: '16px',
    color: '#666',
    margin: 0
  },
  dropzoneHint: {
    fontSize: '13px',
    color: '#999',
    margin: 0
  },
  previewContainer: {
    position: 'relative',
    display: 'inline-block'
  },
  preview: {
    maxWidth: '300px',
    maxHeight: '300px',
    objectFit: 'contain',
    borderRadius: '8px'
  },
  removeBtn: {
    position: 'absolute',
    top: '-10px',
    right: '-10px',
    width: '28px',
    height: '28px',
    background: '#dc2626',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  formSection: {},
  inputGroup: {
    marginBottom: '20px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#555'
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    background: 'white',
    boxSizing: 'border-box'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px'
  },
  keywordInput: {
    display: 'flex',
    gap: '8px'
  },
  addKeywordBtn: {
    padding: '12px',
    background: '#1e88a8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  keywords: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '12px'
  },
  keyword: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    background: '#e3f2fd',
    color: '#1e88a8',
    borderRadius: '20px',
    fontSize: '13px'
  },
  removeKeywordBtn: {
    background: 'none',
    border: 'none',
    color: '#1e88a8',
    cursor: 'pointer',
    padding: '2px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    background: '#1e88a8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer'
  }
};
