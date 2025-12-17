import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { Search, User, LogOut, Upload, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setMobileMenuOpen(false);
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

        {!isMobile && (
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
        )}

        {isMobile ? (
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            style={styles.menuButton}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        ) : (
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
        )}
      </div>

      {isMobile && mobileMenuOpen && (
        <div style={styles.mobileMenu}>
          <form onSubmit={handleSearch} style={styles.mobileSearchForm}>
            <input
              type="text"
              placeholder="Search images..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.mobileSearchInput}
            />
            <button type="submit" style={styles.mobileSearchButton}>
              <Search size={20} />
            </button>
          </form>
          
          <nav style={styles.mobileNav}>
            {isAuthenticated ? (
              <>
                <Link href={isAdmin ? '/dashboard/admin' : '/dashboard'} style={styles.mobileNavLink}>
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>
                <Link href="/dashboard/upload" style={styles.mobileNavLink}>
                  <Upload size={18} />
                  Upload
                </Link>
                <div style={styles.mobileUserInfo}>
                  <div style={styles.userAvatar}>
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span style={styles.mobileUserName}>{user?.username}</span>
                </div>
                <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/user/login" style={styles.mobileNavLink}>
                  <User size={18} />
                  Login
                </Link>
                <Link href="/user/register" style={styles.mobileRegisterBtn}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
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
  menuButton: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mobileMenu: {
    background: '#1e88a8',
    padding: '16px 20px',
    borderTop: '1px solid rgba(255,255,255,0.2)'
  },
  mobileSearchForm: {
    display: 'flex',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '30px',
    overflow: 'hidden',
    marginBottom: '16px'
  },
  mobileSearchInput: {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    background: 'transparent',
    color: 'white',
    fontSize: '14px',
    outline: 'none'
  },
  mobileSearchButton: {
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    color: 'white',
    cursor: 'pointer'
  },
  mobileNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  mobileNavLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 500,
    padding: '12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.1)'
  },
  mobileRegisterBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    background: 'white',
    color: '#1e88a8',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 600,
    padding: '14px',
    borderRadius: '8px'
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '8px'
  },
  mobileUserName: {
    color: 'white',
    fontSize: '16px',
    fontWeight: 500
  },
  mobileLogoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '12px',
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    color: 'white',
    fontSize: '16px',
    fontWeight: 500,
    borderRadius: '8px',
    cursor: 'pointer'
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
