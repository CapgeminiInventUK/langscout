import '../styles/globals.scss';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  // const router = useRouter();
  // const [loading, setLoading] = useState(false);
  //
  // useEffect(() => {
  //   router.events.on('routeChangeError', (e) => setLoading(false));
  //   router.events.on('routeChangeStart', (e) => setLoading(false));
  //   router.events.on('routeChangeComplete', (e) => setLoading(true));
  //
  //   return () => {
  //     router.events.off('routeChangeError', (e) => setLoading(false));
  //     router.events.off('routeChangeStart', (e) => setLoading(false));
  //     router.events.off('routeChangeComplete', (e) => setLoading(true));
  //   };
  // }, [router.events]);
  //
  // if(loading) {
  //   return (
  //     <>
  //       <Head>
  //         <title>LangTrace</title>
  //       </Head>
  //       <SessionProvider session={session}>
  //         <>Loading</>
  //       </SessionProvider>
  //     </>
  //   );
  // }

  return (
    <>
      <Head>
        <title>LangTrace</title>
      </Head>
      <SessionProvider session={session}>
        <Component  {...pageProps} />
      </SessionProvider>
    </>
  );
}

export default MyApp;
