import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/DashboardLayout';
import { getAdminImages, updateImageStatus, getCategories } from '../../../services/api';
import { Check, X, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function AdminImagesPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, isAdmin } = useAuth();
  const { status = 'all' } = router.query;
  
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user/login');
      return;
    }

    if (!authLoading && !isAdmin) {
      router.push('/dashboard');
      return;
    }

    if (isAuthenticated && isAdmin) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, isAdmin, status, pagination.page]);

  const fetchData = async () => {
    try {
      const [imagesData, categoriesData] = await Promise.all([
        getAdminImages({ status, page: pagination.page, limit: 20, search: searchQuery }),
        getCategories()
      ]);
      setImages(imagesData.images || []);
      setPagination(imagesData.pagination || { page: 1, totalPages: 1, total: 0 });
      setCategories(categoriesData.categories || categoriesData || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateImageStatus(id, { status: newStatus });
      fetchData();
      setSelectedImage(null);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'pending': return 'Pending images';
      case 'approved': return 'Approved images';
      case 'rejected': return 'Rejected images';
      default: return 'All images';
    }
  };

  if (authLoading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>{getStatusLabel()} - Admin Dashboard</title>
      </Head>

      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>{getStatusLabel()}: {pagination.total}</h1>
          <div style={styles.headerActions}>
            <input
              type="text"
              placeholder="Search images by title"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchData()}
              style={styles.searchInput}
            />
          </div>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading images...</div>
        ) : (
          <div style={styles.content}>
            <div style={styles.imageGrid}>
              {images.map(image => (
                <div 
                  key={image.id} 
                  style={styles.imageCard}
                  onClick={() => setSelectedImage(image)}
                >
                  <div style={styles.imageWrapper}>
                    <img 
                      src={image.thumbnailPath || image.filePath} 
                      alt={image.title}
                      style={styles.image}
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23f0f0f0" width="100" height="100"/></svg>';
                      }}
                    />
                    <div style={styles.imageOverlay}>
                      <span style={{...styles.statusBadge, ...styles[`status${image.status.charAt(0).toUpperCase() + image.status.slice(1)}`]}}>
                        {image.status}
                      </span>
                    </div>
                  </div>
                  <div style={styles.imageInfo}>
                    <p style={styles.imageViews}>{image.viewCount || 0} views</p>
                    <p style={styles.imageDownloads}>{image.downloadCount || 0} downloads</p>
                  </div>
                  {image.status === 'pending' && (
                    <div style={styles.quickActions}>
                      <button 
                        style={{...styles.actionBtn, ...styles.approveBtn}}
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(image.id, 'approved'); }}
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        style={{...styles.actionBtn, ...styles.rejectBtn}}
                        onClick={(e) => { e.stopPropagation(); handleStatusUpdate(image.id, 'rejected'); }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {images.length === 0 && (
              <div style={styles.emptyState}>
                <p>No {status !== 'all' ? status : ''} images found.</p>
              </div>
            )}

            {pagination.totalPages > 1 && (
              <div style={styles.pagination}>
                <button 
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  style={styles.pageBtn}
                >
                  <ChevronLeft size={20} />
                </button>
                <span style={styles.pageInfo}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button 
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  style={styles.pageBtn}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        )}

        {selectedImage && (
          <div style={styles.modal} onClick={() => setSelectedImage(null)}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button style={styles.closeModal} onClick={() => setSelectedImage(null)}>
                <X size={24} />
              </button>
              
              <div style={styles.modalBody}>
                <div style={styles.modalImage}>
                  <img 
                    src={selectedImage.filePath} 
                    alt={selectedImage.title}
                    style={styles.modalImg}
                  />
                </div>
                
                <div style={styles.modalDetails}>
                  <div style={styles.detailGroup}>
                    <label style={styles.detailLabel}>Title</label>
                    <p style={styles.detailValue}>{selectedImage.title}</p>
                  </div>
                  
                  <div style={styles.detailGroup}>
                    <label style={styles.detailLabel}>Description</label>
                    <p style={styles.detailValue}>{selectedImage.description || 'No description'}</p>
                  </div>
                  
                  <div style={styles.detailGroup}>
                    <label style={styles.detailLabel}>Keywords</label>
                    <div style={styles.keywords}>
                      {(selectedImage.keywords || []).map((kw, i) => (
                        <span key={i} style={styles.keyword}>{kw}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={styles.detailGroup}>
                    <label style={styles.detailLabel}>Category</label>
                    <p style={styles.detailValue}>{selectedImage.category || 'Uncategorized'}</p>
                  </div>
                  
                  <div style={styles.detailGroup}>
                    <label style={styles.detailLabel}>Status</label>
                    <span style={{...styles.statusBadge, ...styles[`status${selectedImage.status.charAt(0).toUpperCase() + selectedImage.status.slice(1)}`]}}>
                      {selectedImage.status}
                    </span>
                  </div>
                  
                  <div style={styles.detailGroup}>
                    <label style={styles.detailLabel}>Contributor</label>
                    <p style={styles.detailValue}>
                      {selectedImage.contributor?.username || 'Unknown'}<br />
                      <small>{selectedImage.contributor?.email}</small>
                    </p>
                  </div>
                  
                  <div style={styles.modalActions}>
                    {selectedImage.status !== 'approved' && (
                      <button 
                        style={{...styles.modalBtn, ...styles.approveBtn}}
                        onClick={() => handleStatusUpdate(selectedImage.id, 'approved')}
                      >
                        <Check size={18} /> Approve
                      </button>
                    )}
                    {selectedImage.status !== 'rejected' && (
                      <button 
                        style={{...styles.modalBtn, ...styles.rejectBtn}}
                        onClick={() => handleStatusUpdate(selectedImage.id, 'rejected')}
                      >
                        <X size={18} /> Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    color: '#666'
  },
  container: {},
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#333',
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '12px'
  },
  searchInput: {
    padding: '10px 16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '14px',
    width: '250px',
    outline: 'none'
  },
  content: {},
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
    gap: '16px'
  },
  imageCard: {
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    position: 'relative'
  },
  imageWrapper: {
    position: 'relative',
    height: '140px',
    background: '#f8f9fa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  imageOverlay: {
    position: 'absolute',
    top: '8px',
    left: '8px'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'capitalize'
  },
  statusPending: {
    background: '#fef3c7',
    color: '#d97706'
  },
  statusApproved: {
    background: '#d1fae5',
    color: '#059669'
  },
  statusRejected: {
    background: '#fee2e2',
    color: '#dc2626'
  },
  imageInfo: {
    padding: '8px 12px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#666'
  },
  imageViews: {
    margin: 0
  },
  imageDownloads: {
    margin: 0
  },
  quickActions: {
    position: 'absolute',
    bottom: '40px',
    right: '8px',
    display: 'flex',
    gap: '4px'
  },
  actionBtn: {
    width: '28px',
    height: '28px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white'
  },
  approveBtn: {
    background: '#059669'
  },
  rejectBtn: {
    background: '#dc2626'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '32px'
  },
  pageBtn: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
  },
  pageInfo: {
    fontSize: '14px',
    color: '#666'
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    background: 'white',
    borderRadius: '12px',
    maxWidth: '900px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative'
  },
  closeModal: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    zIndex: 10
  },
  modalBody: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '24px',
    padding: '24px'
  },
  modalImage: {
    background: '#f8f9fa',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    padding: '20px'
  },
  modalImg: {
    maxWidth: '100%',
    maxHeight: '400px',
    objectFit: 'contain'
  },
  modalDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  detailGroup: {},
  detailLabel: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#666',
    marginBottom: '4px',
    textTransform: 'uppercase'
  },
  detailValue: {
    margin: 0,
    fontSize: '14px',
    color: '#333'
  },
  keywords: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px'
  },
  keyword: {
    padding: '4px 10px',
    background: '#e3f2fd',
    color: '#1e88a8',
    borderRadius: '12px',
    fontSize: '12px'
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginTop: 'auto',
    paddingTop: '16px'
  },
  modalBtn: {
    flex: 1,
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: 'white'
  }
};
