import '../styles/globals.scss';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <>
      <Head>
        <title>Langtrace</title>
      </Head>
      <SessionProvider session={session}>
        <Component  {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
