import React, { ReactNode } from 'react';
import styles from '@/components/SimpleTable/simple-table.module.scss';


interface SimpleTableProps {
  children: ReactNode;
}

const SimpleTable: React.FC<SimpleTableProps> = ({ children }) => {

  return <table className={styles.fullWidthTable}>
    {children}
  </table>;
};

export default SimpleTable;
