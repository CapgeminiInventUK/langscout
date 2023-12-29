import Link from 'next/link';
import styles from './Breadcrumb.module.scss';
import React from "react"; // Import your styles
import { ArrowRight2 } from 'iconic-react';
import {BreadcrumbProps} from "@/components/Breadcrumb/props";

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <>
            {index > 0 && <ArrowRight2/>}
            <li key={index} className={styles.breadcrumbItem}>
            {item.path ? (
              <Link href={item.path}>
                {item.name}
              </Link>
            ) : (
              <span>{item.name}</span>
            )}
          </li>
          </>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
