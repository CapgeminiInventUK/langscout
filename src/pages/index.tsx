import Link from 'next/link';
import styles from './Home.module.scss';
import {Graph, Hierarchy} from "iconic-react";

const Home = () => {
  return (
    <div className={styles.container}>
      <h1>Welcome to LangMonitor</h1>
      <Link href="/traces" className={styles.button}>
          <span className={styles.icon}><Hierarchy /></span>
          Traces
      </Link>
    </div>
  );
};

export default Home;
