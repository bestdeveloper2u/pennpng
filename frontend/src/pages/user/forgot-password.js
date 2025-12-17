import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div style={styles.page}>
        <Head>
          <title>Check Your Email - PNGPoint</title>
        </Head>

        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.successIcon}>
              <CheckCircle size={60} color="#4caf50" />
            </div>
            <h1 style={styles.title}>Check Your Email</h1>
            <p style={styles.message}>
              If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
            </p>
            <Link href="/user/login" style={styles.backButton}>
              <ArrowLeft size={18} />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <Head>
        <title>Forgot Password - PNGPoint</title>
      </Head>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logoSection}>
            <Link href="/" style={styles.logo}>
              <div style={styles.logoIcon}>P</div>
              <div style={styles.logoText}>
                <span style={styles.logoTitle}>pngpoint</span>
                <span style={styles.logoSubtitle}>PNG IMAGE STOCK</span>
              </div>
            </Link>
          </div>

          <h1 style={styles.title}>Forgot Password?</h1>
          <p style={styles.subtitle}>Enter your email and we'll send you a reset link</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <div style={styles.inputWrapper}>
                <Mail size={20} style={styles.inputIcon} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <button type="submit" style={styles.submitButton} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <Link href="/user/login" style={styles.backLink}>
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  container: {
    width: '100%',
    maxWidth: '450px'
  },
  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.5)'
  },
  logoSection: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  logo: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none'
  },
  logoIcon: {
    width: '45px',
    height: '45px',
    background: '#1e88a8',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white'
  },
  logoText: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left'
  },
  logoTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#1e88a8'
  },
  logoSubtitle: {
    fontSize: '8px',
    letterSpacing: '1px',
    color: '#ff6b6b'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
    color: '#333'
  },
  subtitle: {
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#666'
  },
  error: {
    background: '#fee2e2',
    color: '#dc2626',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '14px'
  },
  inputGroup: {
    marginBottom: '24px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 500,
    color: '#555'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#999'
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    outline: 'none',
    boxSizing: 'border-box'
  },
  submitButton: {
    width: '100%',
    padding: '14px',
    background: '#1e88a8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.3s',
    marginBottom: '20px'
  },
  backLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '14px',
    color: '#1e88a8',
    textDecoration: 'none'
  },
  successIcon: {
    textAlign: 'center',
    marginBottom: '20px'
  },
  message: {
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '30px',
    color: '#666',
    lineHeight: 1.6
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    width: '100%',
    padding: '14px',
    background: '#1a1a2e',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600
  }
};
