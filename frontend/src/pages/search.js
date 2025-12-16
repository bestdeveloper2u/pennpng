import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ImageCard from '../components/ImageCard';
import { searchImages } from '../services/api';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  
  const [images, setImages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (q) {
      setSearchQuery(q);
      performSearch(q, 1);
    }
  }, [q]);

  const performSearch = async (query, page) => {
    setLoading(true);
    try {
      const data = await searchImages(query, page, 20);
      setImages(data.images || []);
      setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
    performSearch(q, newPage);
    window.scrollTo(0, 0);
  };

  return (
    <Layout>
      <Head>
        <title>Search: {q || ''} - PNGPoint</title>
      </Head>

      <section style={styles.hero}>
        <div style={styles.container}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <button type="submit" style={styles.searchButton}>
              <Search size={24} />
            </button>
          </form>
        </div>
      </section>

      <section style={styles.results}>
        <div style={styles.container}>
          <h1 style={styles.title}>
            {q ? `Search results for "${q}"` : 'Search Images'}
            {pagination.total > 0 && <span style={styles.count}> ({pagination.total} results)</span>}
          </h1>

          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner}></div>
            </div>
          ) : (
            <>
              <div style={styles.imageGrid}>
                {images.map(image => (
                  <ImageCard key={image.id} image={image} />
                ))}
              </div>

              {images.length === 0 && (
                <div style={styles.emptyState}>
                  <p>No images found for "{q}"</p>
                  <p style={styles.suggestion}>Try different keywords or browse our categories</p>
                </div>
              )}

              {pagination.totalPages > 1 && (
                <div style={styles.pagination}>
                  <button 
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    style={styles.pageBtn}
                  >
                    <ChevronLeft size={20} /> Previous
                  </button>
                  
                  <div style={styles.pageNumbers}>
                    {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        style={{
                          ...styles.pageNumber,
                          ...(page === pagination.page ? styles.pageNumberActive : {})
                        }}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    style={styles.pageBtn}
                  >
                    Next <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1e88a8 0%, #0d5c73 100%)',
    padding: '40px 20px'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px'
  },
  searchForm: {
    display: 'flex',
    maxWidth: '600px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '40px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
  },
  searchInput: {
    flex: 1,
    padding: '16px 24px',
    border: 'none',
    fontSize: '16px',
    outline: 'none'
  },
  searchButton: {
    padding: '16px 24px',
    background: '#1e88a8',
    border: 'none',
    color: 'white',
    cursor: 'pointer'
  },
  results: {
    padding: '40px 20px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '32px',
    color: '#333'
  },
  count: {
    fontSize: '16px',
    fontWeight: 'normal',
    color: '#666'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1e88a8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  },
  suggestion: {
    fontSize: '14px',
    marginTop: '8px'
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '40px',
    flexWrap: 'wrap'
  },
  pageBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px'
  },
  pageNumbers: {
    display: 'flex',
    gap: '8px'
  },
  pageNumber: {
    width: '36px',
    height: '36px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pageNumberActive: {
    background: '#1e88a8',
    color: 'white',
    borderColor: '#1e88a8'
  }
};
