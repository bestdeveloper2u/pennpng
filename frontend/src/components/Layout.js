import Header from './Header';
import Footer from './Footer';

export default function Layout({ children, showFooter = true }) {
  return (
    <div style={styles.layout}>
      <Header />
      <main style={styles.main}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

const styles = {
  layout: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column'
  },
  main: {
    flex: 1
  }
};
