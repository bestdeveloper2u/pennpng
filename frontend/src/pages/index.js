import Head from 'next/head';
import HomeContent from '../components/HomeContent';
import { fetchFiles } from '../services/api';

function HomePage() {
  return (
    <>
      <Head>
        <title>PENN Upload Demo</title>
        <meta name="description" content="SEO-friendly PENN stack file uploader" />
      </Head>
      <div style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh', background: '#f5f7fb' }}>
        <header style={{ padding: '16px', background: '#0f172a', color: '#fff' }}>
          <h1 style={{ margin: 0 }}>PENN Upload Demo</h1>
        </header>
        <main style={{ maxWidth: '960px', margin: '24px auto', padding: '0 16px' }}>
          <HomeContent />
        </main>
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const files = await fetchFiles();
    return { props: { initialFiles: files } };
  } catch (error) {
    console.error('Failed to fetch files for SSR:', error);
    return { props: { initialFiles: [] } };
  }
}

export default HomePage;
