import React, { ReactNode } from 'react';
import styles from '@/components/Panel/panel.module.scss';

interface PanelProps {
  children: ReactNode;
}

const Panel: React.FC<PanelProps> = ({ children }) => {
  return <div className={styles.panel}>
    {children}
  </div>;

};

export default Panel;
