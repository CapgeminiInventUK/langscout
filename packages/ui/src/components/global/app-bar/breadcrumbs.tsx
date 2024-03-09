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
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);

    if (index < segments.length - 1) {
      const href = `/${segments.slice(0, index + 1).join('/')}`;
      acc.push({ href, label });
    } else {
      acc.push({ label });
    }


    return acc;
  }, [{ href: '/', label: 'Home' } as Breadcrumb]);


  return <>{
    breadcrumbMap.length === 1 &&
    <Link className={buttonVariants({ variant: 'link' })} href={'/'}><h1
      className="text-xl font-semibold">Langtrace</h1></Link>
  }
  {breadcrumbMap.length > 1 && (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbMap.map((item, index) => <>
          { index > 0 &&
            <BreadcrumbSeparator/>}
          <BreadcrumbItem key={index}>
            {item.href ? (
              <BreadcrumbLink href={item.href}>
                {item.label}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            )}
          </BreadcrumbItem>

        </>)}
      </BreadcrumbList>
    </Breadcrumb>
  )}
  </>;
}
