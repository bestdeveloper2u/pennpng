import Link from 'next/link';
import { Eye, Download } from 'lucide-react';

export default function ImageCard({ image }) {
  const imageSrc = image.thumbnailPath || image.filePath || '/placeholder.png';
  
  return (
    <Link href={`/image/${image.slug}`} style={styles.card}>
      <div style={styles.imageWrapper}>
        <img 
          src={imageSrc} 
          alt={image.title} 
          style={styles.image}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23f0f0f0" width="200" height="200"/><text fill="%23999" x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="14">No Image</text></svg>';
          }}
        />
        <div style={styles.overlay}>
          <span style={styles.viewBtn}>View Details</span>
        </div>
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{image.title}</h3>
        <div style={styles.stats}>
          <span style={styles.stat}>
            <Eye size={14} /> {image.viewCount || 0}
          </span>
          <span style={styles.stat}>
            <Download size={14} /> {image.downloadCount || 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

const styles = {
  card: {
    display: 'block',
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    border: '1px solid #eee'
  },
  imageWrapper: {
    position: 'relative',
    height: '180px',
    background: '#fafafa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.3s'
  },
  viewBtn: {
    padding: '10px 20px',
    background: 'white',
    color: '#333',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600
  },
  content: {
    padding: '12px'
  },
  title: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#333',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  stats: {
    display: 'flex',
    gap: '12px'
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#999'
  }
};
