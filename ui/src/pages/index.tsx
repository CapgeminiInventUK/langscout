import Link from 'next/link';
import styles from './Home.module.scss';
import { Login, Setting, Clipboard, Hierarchy } from 'iconic-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Panel from '@/components/Panel';
import Breadcrumb from '@/components/Breadcrumb';

const Home = () => {
  const { data: session, status } = useSession();
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
  ];

  if (status === 'loading') {
    return <p>Hang on there...</p>;
  }
  if (status === 'authenticated') {
    return (

      <div className={styles.container}>
        <div className={styles.appBar}>
          <Breadcrumb items={breadcrumbItems}/>
          LangTrace
          {session?.user !== undefined &&
            <button className={styles.button} onClick={() => signOut()}>Sign out</button>}
        </div>
        <div className={styles.mainContent}>
          <div className={styles.mainPanel}>
            <Panel>
              <div className={styles.row_centre}>
                <Link href="/projects" className={styles.button}>
                  <span className={styles.icon}><Clipboard/></span>
                  Projects
                </Link>
                <br/>
                <Link href="/settings" className={styles.button}>
                  <span className={styles.icon}><Setting/></span>
                  Settings
                </Link>
              </div>
            </Panel>
          </div>

          <div className={styles.quickLaunchPanel}>
            <Panel>
              <h3> Quick links</h3>
              <Link href="/projects/capgpt-production/traces" className={styles.button}>
                <span className={styles.icon}><Hierarchy/></span>
                CapGPT Prod Traces
              </Link>
              <br/>
              <Link href="/projects/capgpt-local/traces" className={styles.button}>
                <span className={styles.icon}><Hierarchy/></span>
                CapGPT Local Traces
              </Link>
              <br/>
              <Link href="/projects/capgpt-dev/traces" className={styles.button}>
                <span className={styles.icon}><Hierarchy/></span>
                CapGPT Dev Traces
              </Link>
            </Panel>
          </div>
        </div>
      </div>

    );
  }

  return (
    <>
      <div className={styles.container}>
        <Panel>
          <h1>LangTrace</h1>
          <pre>View your Langchain data</pre>
          <button className={styles.button} onClick={() => signIn('github')}>
            <span
              className={styles.icon}><Login/></span>Sign in
          </button>
        </Panel>
      </div>
    </>
  );
};

export default Home;
