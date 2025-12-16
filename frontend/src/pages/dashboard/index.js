import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import { getContributorDashboard } from '../../services/api';
import { Image, Download, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function ContributorDashboard() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user/login');
      return;
    }

    if (!authLoading && isAdmin) {
      router.push('/dashboard/admin');
      return;
    }

    if (isAuthenticated && !isAdmin) {
      fetchStats();
    }
  }, [isAuthenticated, authLoading, isAdmin]);

  const fetchStats = async () => {
    try {
      const data = await getContributorDashboard();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || (!isAuthenticated && !loading)) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard - PNGPoint</title>
      </Head>

      <div style={styles.container}>
        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, ...styles.statBlue}}>
            <div style={styles.statContent}>
              <h3 style={styles.statLabel}>Total Images</h3>
              <p style={styles.statValue}>{stats?.total_images || 0}</p>
            </div>
            <div style={styles.statContent}>
              <h3 style={styles.statLabel}>All Downloads</h3>
              <p style={styles.statValue}>{stats?.total_downloads || 0}</p>
            </div>
          </div>

          <div style={{...styles.statCard, ...styles.statOrange}}>
            <h3 style={styles.statLabel}>Pending Images</h3>
            <p style={styles.statValue}>{stats?.pending_images || 0}</p>
          </div>
        </div>

        <div style={styles.statsGrid}>
          <div style={{...styles.statCard, ...styles.statGreen}}>
            <h3 style={styles.statLabel}>Approved Images</h3>
            <p style={styles.statValue}>{stats?.approved_images || 0}</p>
          </div>

          <div style={{...styles.statCard, ...styles.statRed}}>
            <h3 style={styles.statLabel}>Rejected Images</h3>
            <p style={styles.statValue}>{stats?.rejected_images || 0}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#666'
  },
  container: {
    maxWidth: '1200px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  statCard: {
    padding: '30px',
    borderRadius: '8px',
    color: 'white'
  },
  statBlue: {
    background: 'linear-gradient(135deg, #1e88a8 0%, #156580 100%)',
    display: 'flex',
    justifyContent: 'space-between'
  },
  statOrange: {
    background: 'linear-gradient(135deg, #c5913e 0%, #a87832 100%)'
  },
  statGreen: {
    background: 'linear-gradient(135deg, #4a7c59 0%, #3d6749 100%)'
  },
  statRed: {
    background: 'linear-gradient(135deg, #8b4049 0%, #723439 100%)'
  },
  statContent: {},
  statLabel: {
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: '8px',
    opacity: 0.9
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    margin: 0
  }
};
