import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Search, User, LogOut, Upload, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link href="/" style={styles.logo}>
          <div style={styles.logoIcon}>P</div>
          <div style={styles.logoText}>
            <span style={styles.logoTitle}>Pngpoint</span>
            <span style={styles.logoSubtitle}>PNG IMAGE STOCK</span>
          </div>
        </Link>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            <Search size={20} />
          </button>
        </form>

        <nav style={styles.nav}>
          {isAuthenticated ? (
            <>
              <Link href={isAdmin ? '/dashboard/admin' : '/dashboard'} style={styles.navLink}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link href="/dashboard/upload" style={styles.navLink}>
                <Upload size={18} />
                Upload
              </Link>
              <div style={styles.userMenu}>
                <div style={styles.userAvatar}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={styles.userName}>{user?.username}</span>
                <button onClick={handleLogout} style={styles.logoutBtn}>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link href="/user/login" style={styles.navLink}>
                <User size={18} />
                Login
              </Link>
              <Link href="/user/register" style={styles.registerBtn}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: '#1e88a8',
    padding: '12px 0',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
    color: 'white'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: 'white',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e88a8'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column'
  },
  logoTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    lineHeight: 1.2
  },
  logoSubtitle: {
    fontSize: '8px',
    letterSpacing: '1px',
    opacity: 0.9
  },
  searchForm: {
    flex: 1,
    maxWidth: '500px',
    display: 'flex',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '30px',
    overflow: 'hidden',
    backdropFilter: 'blur(10px)'
  },
  searchInput: {
    flex: 1,
    padding: '12px 20px',
    border: 'none',
    background: 'transparent',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  },
  searchButton: {
    padding: '12px 20px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 500,
    padding: '8px 12px',
    borderRadius: '8px',
    transition: 'background 0.2s'
  },
  registerBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'white',
    color: '#1e88a8',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
    padding: '10px 20px',
    borderRadius: '8px',
    transition: 'transform 0.2s'
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    background: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#1e88a8'
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 500
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    padding: '8px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};
