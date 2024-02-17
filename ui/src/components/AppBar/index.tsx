import styles from './app-bar.module.scss';
import { BreadcrumbItem } from '@/components/Breadcrumb/props';
import Breadcrumb from '@/components/Breadcrumb';
import React from 'react';
import { MdLogout } from 'react-icons/md';
import { signOut, useSession } from 'next-auth/react';

interface AppBarProps {
  breadcrumbItems: BreadcrumbItem[];
}

const AppBar: React.FC<AppBarProps> = ({ breadcrumbItems }) => {
  const { status } = useSession();

  return (
    <div className={styles.appBar}>
      <Breadcrumb items={breadcrumbItems}/>
      {status === 'authenticated' &&
        <div onClick={() => signOut()}>
          <span><MdLogout size={20}/></span>
        </div>
      }
    </div>
  );
};

export default AppBar;
