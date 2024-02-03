import React, { ReactNode } from 'react';
import styles from '@/components/Panel/Panel.module.scss';

interface PanelProps {
  children: ReactNode;
}

const Panel: React.FC<PanelProps> = ({  children } ) => {
    return <div className={styles.panel}>
        {children}
    </div>;

};

export default Panel;
