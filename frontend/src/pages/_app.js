import Head from 'next/head';
import { UploadProvider } from '../context/UploadContext';

function App({ Component, pageProps }) {
  const initialFiles = pageProps?.initialFiles || [];

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <UploadProvider initialFiles={initialFiles}>
        <Component {...pageProps} />
      </UploadProvider>
    </>
  );
}

export default App;
