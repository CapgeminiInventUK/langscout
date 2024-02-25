import React from 'react';
import Breadcrumbs, { BreadcrumbItem } from '@/components/global/app-bar/breadcrumbs';
import { getServerSession } from 'next-auth';
import SignOutIconButton from '@/components/global/app-bar/sign-out-icon-button';
import ThemeToggle from '@/components/global/app-bar/theme-toggle';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { authOptions } from '@/lib/utils/auth-options';

interface AppBarProps {
  breadcrumbItems: BreadcrumbItem[];
}

export default async function AppBar({ breadcrumbItems }: AppBarProps) {
  const session = await getServerSession(authOptions);

  return (
    <div className="border-b">
      <div className="flex h-12 items-center px-4">
        {
          breadcrumbItems.length === 0 &&
          <Link className={buttonVariants({ variant: 'link' })} href={'/'}><h1
            className="text-2xl font-semibold">Langtrace</h1></Link>
        }
        {breadcrumbItems.length >= 1 && <Breadcrumbs items={breadcrumbItems}/>}
        <div className="ml-auto flex items-end space-x-2">
          <ThemeToggle/>
          {session &&
            <SignOutIconButton/>
          }
        </div>
      </div>
    </div>
  );
}
