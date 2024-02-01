import Link from 'next/link';
import styles from './Home.module.scss';
import { Login, Hierarchy } from 'iconic-react';
import { signIn, signOut, useSession } from 'next-auth/react';

const Home = () => {
  const { data: session, status } = useSession();
  // const userEmail = session?.user?.email;

  if (status === 'loading') {
    return <p>Hang on there...</p>;
  }
  if (status === 'authenticated') {
    return (
      <div className={styles.container}>
        <div className={styles.homePanel}>

          {session?.user !== undefined &&
            <button className={styles.button} onClick={() => signOut()}>Sign out</button>}
          <h1>LangTrace</h1>
          <pre>View your Langchain data</pre>
          <Link href="/traces" className={styles.button}>
            <span className={styles.icon}><Hierarchy/></span>
            Traces
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.homePanel}>
          <h1>LangTrace</h1>
          <pre>View your Langchain data</pre>
          <button className={styles.button} onClick={() => signIn('github')}>
            <span
              className={styles.icon}><Login/></span>Sign in
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
