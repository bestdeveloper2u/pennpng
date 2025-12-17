import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ImageCard from '../../components/ImageCard';
import { ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';

export default function CategoryPage({ category, images, pagination, subcategories }) {
  const router = useRouter();
  const { slug, subcategory, page = 1 } = router.query;
  const [viewMode, setViewMode] = useState('grid');

  if (router.isFallback) {
    return (
      <Layout>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  const handlePageChange = (newPage) => {
    const query = { slug };
    if (subcategory) query.subcategory = subcategory;
    if (newPage > 1) query.page = newPage;
    router.push({ pathname: `/category/${slug}`, query });
  };

  return (
    <Layout>
      <Head>
        <title>{category?.name || 'Category'} - PNGPoint</title>
        <meta name="description" content={`Download free ${category?.name} PNG images with transparent background`} />
      </Head>

      <div style={styles.breadcrumb}>
        <div style={styles.container}>
          <Link href="/" style={styles.breadcrumbLink}>Home</Link>
          <span style={styles.breadcrumbSeparator}>/</span>
          <span style={styles.breadcrumbCurrent}>{category?.name || 'Category'}</span>
        </div>
      </div>

      <section style={styles.header}>
        <div style={styles.container}>
          <h1 style={styles.title}>{category?.name || 'Category'}</h1>
          {category?.description && (
            <p style={styles.description}>{category.description}</p>
          )}
        </div>
      </section>

      {subcategories && subcategories.length > 0 && (
        <section style={styles.subcategories}>
          <div style={styles.container}>
            <div style={styles.subcategoryTabs}>
              <Link
                href={`/category/${slug}`}
                style={{
                  ...styles.subcategoryTab,
                  ...((!subcategory) ? styles.subcategoryTabActive : {})
                }}
              >
                All
              </Link>
              {subcategories.map(sub => (
                <Link
                  key={sub.id}
                  href={`/category/${slug}?subcategory=${sub.slug}`}
                  style={{
                    ...styles.subcategoryTab,
                    ...(subcategory === sub.slug ? styles.subcategoryTabActive : {})
                  }}
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={styles.content}>
        <div style={styles.container}>
          <div style={styles.toolbar}>
            <p style={styles.resultCount}>
              {pagination?.total || 0} images found
            </p>
            <div style={styles.viewToggle}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  ...styles.viewButton,
                  ...(viewMode === 'grid' ? styles.viewButtonActive : {})
                }}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  ...styles.viewButton,
                  ...(viewMode === 'list' ? styles.viewButtonActive : {})
                }}
              >
                <List size={18} />
              </button>
            </div>
          </div>

          {images && images.length > 0 ? (
            <div style={viewMode === 'grid' ? styles.imageGrid : styles.imageList}>
              {images.map(image => (
                <ImageCard key={image.id} image={image} />
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No images found in this category yet.</p>
              <Link href="/user/register" style={styles.ctaButton}>
                Become a Contributor
              </Link>
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                style={styles.pageButton}
              >
                <ChevronLeft size={18} />
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                style={styles.pageButton}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps({ params, query }) {
  const API_URL = process.env.API_URL || 'http://0.0.0.0:3001';
  const { slug } = params;
  const { subcategory, page = 1 } = query;

  try {
    let categoryUrl = `${API_URL}/api/categories/${slug}`;
    const categoryRes = await fetch(categoryUrl);
    const categoryData = categoryRes.ok ? await categoryRes.json() : null;

    let imagesUrl = `${API_URL}/api/images?category=${slug}&page=${page}&limit=24`;
    if (subcategory) imagesUrl += `&subcategory=${subcategory}`;
    
    const imagesRes = await fetch(imagesUrl);
    const imagesData = imagesRes.ok ? await imagesRes.json() : { images: [], pagination: {} };

    return {
      props: {
        category: categoryData?.category || { name: slug, slug },
        images: imagesData.images || [],
        pagination: imagesData.pagination || { page: 1, totalPages: 1, total: 0 },
        subcategories: categoryData?.subcategories || []
      }
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      props: {
        category: { name: slug, slug },
        images: [],
        pagination: { page: 1, totalPages: 1, total: 0 },
        subcategories: []
      }
    };
  }
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1e88a8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  breadcrumb: {
    background: '#f8f9fa',
    padding: '12px 0',
    borderBottom: '1px solid #e9ecef'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px'
  },
  breadcrumbLink: {
    color: '#1e88a8',
    textDecoration: 'none',
    fontSize: '14px'
  },
  breadcrumbSeparator: {
    margin: '0 8px',
    color: '#999'
  },
  breadcrumbCurrent: {
    color: '#666',
    fontSize: '14px'
  },
  header: {
    padding: '40px 0',
    background: 'linear-gradient(135deg, #1e88a8 0%, #0d5c73 100%)',
    color: 'white',
    textAlign: 'center'
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  description: {
    fontSize: '16px',
    opacity: 0.9,
    maxWidth: '600px',
    margin: '0 auto'
  },
  subcategories: {
    padding: '20px 0',
    background: '#fff',
    borderBottom: '1px solid #e9ecef'
  },
  subcategoryTabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center'
  },
  subcategoryTab: {
    padding: '8px 16px',
    background: '#f8f9fa',
    border: '1px solid #e9ecef',
    borderRadius: '20px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  subcategoryTabActive: {
    background: '#1e88a8',
    color: 'white',
    borderColor: '#1e88a8'
  },
  content: {
    padding: '40px 0'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  resultCount: {
    color: '#666',
    fontSize: '14px',
    margin: 0
  },
  viewToggle: {
    display: 'flex',
    gap: '4px',
    background: '#f8f9fa',
    padding: '4px',
    borderRadius: '8px'
  },
  viewButton: {
    padding: '8px 12px',
    background: 'transparent',
    border: 'none',
    borderRadius: '6px',
    color: '#666',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  viewButtonActive: {
    background: 'white',
    color: '#1e88a8',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  imageGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px'
  },
  imageList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#666'
  },
  ctaButton: {
    display: 'inline-block',
    marginTop: '20px',
    padding: '12px 30px',
    background: '#1e88a8',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '40px',
    flexWrap: 'wrap'
  },
  pageButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '10px 16px',
    background: 'white',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    color: '#333',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  pageInfo: {
    color: '#666',
    fontSize: '14px'
  }
};
