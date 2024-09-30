'use client';

import Link from 'next/link';
import React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(segment => segment);

  interface Breadcrumb {
    href?: string;
    label: string;
  }

  const breadcrumbMap = segments.reduce((acc, segment, index) => {
    if (index < segments.length - 1) {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      acc.push({ href, label: segment });
    } else {
      acc.push({ label: segment });
    }


    return acc;
  }, [{ href: '/', label: 'home' } as Breadcrumb]);


  return <>{
    breadcrumbMap.length === 1 &&
    <Link className={buttonVariants({ variant: 'link' })} href={'/'}><h1
      className="text-xl font-semibold">langscout</h1></Link>
  }
  {breadcrumbMap.length > 1 && (
    <Breadcrumb>
      <BreadcrumbList key={'breadcrumb-list'}>
        {breadcrumbMap.map((item, index) => <>
          {index > 0 &&
              <BreadcrumbSeparator key={index + '-separator'}/>}
          <BreadcrumbItem key={index + '-item'}>
            {item.href ? (
              <BreadcrumbLink key={index + '-link'} href={item.href}>
                {item.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage key={index + '-page'}>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        </>)}
      </BreadcrumbList>
    </Breadcrumb>
  )}
  </>;
}
