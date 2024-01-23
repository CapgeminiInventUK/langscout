import Link from 'next/link';
import styles from './Home.module.scss';
import {Hierarchy} from "iconic-react";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.homePanel}>
      <h1>LangTrace</h1>
      <pre>View your Langchain data</pre>
      <Link href="/traces" className={styles.button}>
        <span className={styles.icon}><Hierarchy/></span>
        Traces
      </Link>
      </div>
    </div>
  );
};

export default Home;
