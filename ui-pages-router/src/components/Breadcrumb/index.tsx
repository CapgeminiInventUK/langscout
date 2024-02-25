import Link from 'next/link';
import React from 'react';
import { RiArrowDropRightFill } from 'react-icons/ri';
import { buttonVariants } from '@/components/ui/button';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}


const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex my-0 items-center text-sm font-light pl-0 list-none">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <RiArrowDropRightFill size={20}/>}
            <li key={index}>
              {item.path ? (
                <Link className={buttonVariants({ variant: 'link' })} href={item.path}>
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
