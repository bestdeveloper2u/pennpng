import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import '../styles/globals.css';

function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>PNGPoint - Free Download Transparent PNG Files</title>
        <meta name="description" content="Free download transparent PNG files. High quality PNG images for designers." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  );
}

export default App;
