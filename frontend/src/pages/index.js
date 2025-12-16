import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ImageCard from '../components/ImageCard';
import { getCategories, getImages } from '../services/api';
import { Search } from 'lucide-react';

export default function HomePage({ categories = [], images = [], trendingTags = [] }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <Layout>
      <Head>
        <title>PNGPoint - Free Download Transparent PNG Files</title>
      </Head>

      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.logoSection}>
            <div style={styles.heroLogo}>
              <div style={styles.logoIcon}>P</div>
              <div style={styles.logoText}>
                <span style={styles.logoTitle}>Pngpoint</span>
                <span style={styles.logoSubtitle}>PNG IMAGE STOCK</span>
              </div>
            </div>
          </div>
          <h1 style={styles.heroTitle}>FREE DOWNLOAD TRANSPARENT<br />PNG FILES</h1>
          
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

          <div style={styles.categories}>
            {categories.map(cat => (
              <Link key={cat.id} href={`/category/${cat.slug}`} style={styles.categoryLink}>
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>TRENDING IMAGES FOR DESIGNERS</h2>
          
          <div style={styles.imageGrid}>
            {images.map(image => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>

          {images.length === 0 && (
            <div style={styles.emptyState}>
              <p>No images available yet. Be the first to upload!</p>
              <Link href="/user/register" style={styles.ctaButton}>
                Become a Contributor
              </Link>
            </div>
          )}

          {images.length > 0 && (
            <div style={styles.viewMore}>
              <Link href="/images" style={styles.viewMoreBtn}>
                View All Images
              </Link>
            </div>
          )}
        </div>
      </section>

      {trendingTags.length > 0 && (
        <section style={styles.tagsSection}>
          <div style={styles.container}>
            <h3 style={styles.tagsSectionTitle}>Trending Tags Today</h3>
            <div style={styles.tagsContainer}>
              {trendingTags.map((tag, index) => (
                <Link key={index} href={`/search?q=${encodeURIComponent(tag)}`} style={styles.tag}>
                  {tag} png
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [categoriesRes, imagesRes] = await Promise.all([
      fetch('http://localhost:3001/api/categories').then(r => r.ok ? r.json() : { categories: [] }).catch(() => ({ categories: [] })),
      fetch('http://localhost:3001/api/images?limit=12').then(r => r.ok ? r.json() : { images: [] }).catch(() => ({ images: [] }))
    ]);

    return {
      props: {
        categories: categoriesRes.categories || categoriesRes || [],
        images: imagesRes.images || [],
        trendingTags: ['angel', 'arrow', 'butterfly', 'smoke', 'frame', 'emoji', 'mockup', 'logo']
      }
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      props: {
        categories: [],
        images: [],
        trendingTags: []
      }
    };
  }
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #1e88a8 0%, #0d5c73 100%)',
    padding: '60px 20px',
    textAlign: 'center',
    color: 'white'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  logoSection: {
    marginBottom: '24px'
  },
  heroLogo: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '12px'
  },
  logoIcon: {
    width: '50px',
    height: '50px',
    background: 'white',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1e88a8'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  logoTitle: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  logoSubtitle: {
    fontSize: '10px',
    letterSpacing: '1px',
    opacity: 0.9
  },
  heroTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '32px',
    lineHeight: 1.3
  },
  searchForm: {
    display: 'flex',
    maxWidth: '600px',
    margin: '0 auto 32px',
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
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '8px'
  },
  categoryLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '13px',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'background 0.2s'
  },
  section: {
    padding: '60px 20px'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '40px',
    color: '#333'
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
  viewMore: {
    textAlign: 'center',
    marginTop: '40px'
  },
  viewMoreBtn: {
    display: 'inline-block',
    padding: '12px 30px',
    background: '#1a1a2e',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 600
  },
  tagsSection: {
    padding: '40px 20px',
    background: '#f8f9fa'
  },
  tagsSectionTitle: {
    textAlign: 'center',
    marginBottom: '24px',
    fontSize: '16px',
    color: '#333'
  },
  tagsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px'
  },
  tag: {
    padding: '8px 16px',
    background: 'white',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '13px',
    color: '#555',
    textDecoration: 'none',
    transition: 'all 0.2s'
  }
};
