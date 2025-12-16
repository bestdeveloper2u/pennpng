import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Upload, Image, CheckCircle, Clock, XCircle, 
  Folder, FolderOpen, Settings, User, Key, Users, LogOut, Cloud
} from 'lucide-react';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const currentPath = router.pathname;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const contributorMenu = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/upload', icon: Upload, label: 'Upload Images' },
    { href: '/dashboard/images', icon: Image, label: 'Total Images' },
    { href: '/dashboard/images?status=approved', icon: CheckCircle, label: 'Approved Images' },
    { href: '/dashboard/images?status=pending', icon: Clock, label: 'Pending Images' },
    { href: '/dashboard/images?status=rejected', icon: XCircle, label: 'Rejected Images' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings', submenu: [
      { href: '/dashboard/settings/profile', label: 'Profile' },
      { href: '/dashboard/settings/password', label: 'Change Password' }
    ]}
  ];

  const adminMenu = [
    { href: '/dashboard/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/admin/upload', icon: Upload, label: 'Upload Images' },
    { href: '/dashboard/admin/images', icon: Image, label: 'Total Images' },
    { href: '/dashboard/admin/images?status=approved', icon: CheckCircle, label: 'Approved Images' },
    { href: '/dashboard/admin/images?status=pending', icon: Clock, label: 'Pending Images' },
    { href: '/dashboard/admin/images?status=rejected', icon: XCircle, label: 'Rejected Images' },
    { href: '/dashboard/admin/categories', icon: Folder, label: 'Categories' },
    { href: '/dashboard/admin/subcategories', icon: FolderOpen, label: 'Sub Categories' },
    { href: '/dashboard/admin/settings', icon: Settings, label: 'Settings', submenu: [
      { href: '/dashboard/admin/settings/profile', label: 'Profile' },
      { href: '/dashboard/admin/settings/password', label: 'Change Password' },
      { href: '/dashboard/admin/users', label: 'Users' },
      { href: '/dashboard/admin/cloudflare', label: 'Cloudflare Api' }
    ]},
    { href: '/dashboard/admin/logout', icon: LogOut, label: 'Logout', action: handleLogout }
  ];

  const menu = isAdmin ? adminMenu : contributorMenu;
  const currentYear = new Date().getFullYear();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  return (
    <div style={styles.layout}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <Link href="/" style={styles.logo}>
            <div style={styles.logoIcon}>P</div>
            <div style={styles.logoText}>
              <span style={styles.logoTitle}>pngpoint</span>
              <span style={styles.logoSubtitle}>PNG IMAGE STOCK</span>
            </div>
          </Link>
        </div>

        <nav style={styles.nav}>
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
            
            if (item.action) {
              return (
                <button key={item.label} onClick={item.action} style={{...styles.navItem, ...(isActive ? styles.navItemActive : {})}}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <div key={item.href}>
                <Link href={item.href} style={{...styles.navItem, ...(isActive ? styles.navItemActive : {})}}>
                  <Icon size={18} />
                  <span>{item.label}</span>
                </Link>
                {item.submenu && (
                  <div style={styles.submenu}>
                    {item.submenu.map(sub => (
                      <Link key={sub.href} href={sub.href} style={styles.submenuItem}>
                        • {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div style={styles.mainArea}>
        <header style={styles.header}>
          <Link href="/dashboard/upload" style={styles.uploadBtn}>
            UPLOAD
          </Link>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main style={styles.main}>
          {children}
        </main>

        <footer style={styles.footer}>
          Copyright © {currentYear} PNGPoint • All rights reserved • Enjoy the rest of your {today}!
        </footer>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f5f7fb'
  },
  sidebar: {
    width: '260px',
    background: '#1e88a8',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    overflowY: 'auto'
  },
  sidebarHeader: {
    padding: '20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1e88a8'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column'
  },
  logoTitle: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  logoSubtitle: {
    fontSize: '8px',
    letterSpacing: '1px',
    opacity: 0.8
  },
  nav: {
    padding: '20px 0',
    flex: 1
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 20px',
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    fontSize: '14px',
    transition: 'all 0.2s',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer'
  },
  navItemActive: {
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    borderLeft: '3px solid white'
  },
  submenu: {
    paddingLeft: '50px'
  },
  submenuItem: {
    display: 'block',
    padding: '8px 0',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '13px'
  },
  mainArea: {
    flex: 1,
    marginLeft: '260px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  header: {
    background: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
  },
  uploadBtn: {
    padding: '10px 30px',
    background: 'white',
    border: '2px solid #333',
    borderRadius: '25px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#333',
    textDecoration: 'none',
    transition: 'all 0.2s'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center'
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    background: '#1e88a8',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold'
  },
  main: {
    flex: 1,
    padding: '30px'
  },
  footer: {
    textAlign: 'center',
    padding: '20px',
    fontSize: '13px',
    color: '#666',
    borderTop: '1px solid #eee'
  }
};
