import Link from 'next/link';
import styles from './breadcrumb.module.scss';
import React from 'react';
import { MdChevronRight } from 'react-icons/md';
import { BreadcrumbProps } from '@/components/Breadcrumb/props';

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <MdChevronRight size={20}/>}
            <li key={index} className={styles.breadcrumbItem}>
              {item.path ? (
                <Link href={item.path}>
                  {item.name}
                </Link>
              ) : (
                <span key={'end-breadcrumb-' + index}>{item.name}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
