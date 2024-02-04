import styles from './home.module.scss';
import { MdLogin, MdSettings, MdAccountTree, MdAssignment } from 'react-icons/md';
import { signIn, useSession } from 'next-auth/react';
import Panel from '@/components/Panel';
import OutlineButton from '@/components/OutlineButton';
import AppBar from '@/components/AppBar';

const Home = () => {
  const { status } = useSession();
  const breadcrumbItems = [
    { name: '', path: undefined },
  ];

  if (status === 'loading') {
    return <p>Hang on there...</p>;
  }
  if (status === 'authenticated') {
    return (

      <div>
        <AppBar breadcrumbItems={breadcrumbItems}/>
        <h1>Home</h1>

        <div className={styles.mainContent}>
          <div className={styles.mainPanel}>
            <Panel>
              <div className={styles.row_centre}>
                <OutlineButton href="/projects">
                  <span className={styles.icon}><MdAssignment/></span>
                  Projects
                </OutlineButton>
                <br/>
                <OutlineButton href="/settings">
                  <span className={styles.icon}><MdSettings/></span>
                  Settings
                </OutlineButton>
              </div>
            </Panel>
          </div>

          <div className={styles.quickLaunchPanel}>
            <Panel>
              <h3> Quick links</h3>
              <OutlineButton href="/projects/capgpt-production/traces">
                <span className={styles.icon}><MdAccountTree/></span>
                CapGPT Prod Traces
              </OutlineButton>
              <br/>
              <OutlineButton href="/projects/capgpt-local/traces">
                <span className={styles.icon}><MdAccountTree/></span>
                CapGPT Local Traces
              </OutlineButton>
              <br/>
              <OutlineButton href="/projects/capgpt-dev/traces">
                <span className={styles.icon}><MdAccountTree/></span>
                CapGPT Dev Traces
              </OutlineButton>
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
          <OutlineButton onClick={() => signIn('github')}>
            <span
              className={styles.icon}><MdLogin/></span>Sign in
          </OutlineButton>
        </Panel>
      </div>
    </>
  );
};

export default Home;
