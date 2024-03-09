import Link from 'next/link';
import React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { ChevronRightIcon } from '@radix-ui/react-icons';

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}


export default function Breadcrumbs({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="flex my-0 items-center text-sm font-light pl-0 list-none">
        {items.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRightIcon/>}
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
}
