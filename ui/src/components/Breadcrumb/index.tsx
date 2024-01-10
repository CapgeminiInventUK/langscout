import Link from 'next/link';
import styles from './Breadcrumb.module.scss';
import React from "react";
import { BsChevronRight } from "react-icons/bs";
import {BreadcrumbProps} from "@/components/Breadcrumb/props";

const Breadcrumb: React.FC<BreadcrumbProps> = ({items}) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => (
          <>
            {index > 0 && <BsChevronRight size={14}/>}
            <li key={index} className={styles.breadcrumbItem}>
              {item.path ? (
                <Link href={item.path}>
                  {item.name}
                </Link>
              ) : (
                <span key={"end-breadcrumb-" + index}>{item.name}</span>
              )}
            </li>
          </>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
