import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = days[new Date().getDay()];

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          <div style={styles.column}>
            <div style={styles.logo}>
              <div style={styles.logoIcon}>P</div>
              <div style={styles.logoText}>
                <span style={styles.logoTitle}>Pngpoint</span>
                <span style={styles.logoSubtitle}>PNG IMAGE STOCK</span>
              </div>
            </div>
            <p style={styles.tagline}>FREE DOWNLOAD TRANSPARENT<br />PNG FILES NO COPYRIGHT</p>
            <div style={styles.socials}>
              <a href="#" style={styles.socialLink}>X</a>
              <a href="#" style={styles.socialLink}>f</a>
              <a href="#" style={styles.socialLink}>P</a>
              <a href="#" style={styles.socialLink}>in</a>
            </div>
          </div>

          <div style={styles.column}>
            <h4 style={styles.columnTitle}>RESOURCES</h4>
            <ul style={styles.linkList}>
              <li><Link href="/categories" style={styles.link}>CATEGORIES</Link></li>
              <li><Link href="/subcategories" style={styles.link}>SUB CATEGORIES</Link></li>
              <li><Link href="/user/login" style={styles.link}>CONTRIBUTOR LOGIN</Link></li>
              <li><Link href="/user/register" style={styles.link}>CONTRIBUTOR REGISTER</Link></li>
            </ul>
          </div>

          <div style={styles.column}>
            <h4 style={styles.columnTitle}>COMPANY</h4>
            <ul style={styles.linkList}>
              <li><Link href="/about" style={styles.link}>ABOUT US</Link></li>
              <li><Link href="/contact" style={styles.link}>CONTACT</Link></li>
              <li><Link href="/terms" style={styles.link}>TERMS</Link></li>
              <li><Link href="/privacy" style={styles.link}>PRIVACY</Link></li>
              <li><Link href="/license" style={styles.link}>LICENSE</Link></li>
            </ul>
          </div>

          <div style={styles.column}>
            <h4 style={styles.columnTitle}>COMMUNITY</h4>
            <ul style={styles.linkList}>
              <li><a href="#" style={styles.link}>X</a></li>
              <li><a href="#" style={styles.link}>PINTEREST</a></li>
              <li><a href="#" style={styles.link}>INSTAGRAM</a></li>
              <li><a href="#" style={styles.link}>FACEBOOK</a></li>
            </ul>
          </div>
        </div>

        <div style={styles.copyright}>
          Copyright © {currentYear} PNGPoint • All rights reserved • Enjoy the rest of your {today}!
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#2d3748',
    color: 'white',
    padding: '60px 0 30px'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '40px'
  },
  column: {},
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '16px'
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    background: '#1e88a8',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white'
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
    opacity: 0.8
  },
  tagline: {
    fontSize: '12px',
    opacity: 0.7,
    marginBottom: '16px',
    lineHeight: 1.5
  },
  socials: {
    display: 'flex',
    gap: '10px'
  },
  socialLink: {
    width: '32px',
    height: '32px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    textDecoration: 'none',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  columnTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: 'white'
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0
  },
  link: {
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    fontSize: '13px',
    display: 'block',
    padding: '6px 0',
    transition: 'color 0.2s'
  },
  copyright: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.6)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '30px'
  }
};
