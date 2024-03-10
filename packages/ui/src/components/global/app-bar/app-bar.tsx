import React from 'react';
import Breadcrumbs from '@/components/global/app-bar/breadcrumbs';
import { getServerSession } from 'next-auth';
import SignOutIconButton from '@/components/global/app-bar/sign-out-icon-button';
import ThemeToggle from '@/components/global/app-bar/theme-toggle';
import { authOptions } from '@/lib/utils/auth-options';


export default async function AppBar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="border-b">
      <div className="flex h-12 items-center px-4">
        <Breadcrumbs/>
        <div className="ml-auto flex items-end space-x-2">
          <ThemeToggle/>
          {(session && process.env.NEXTAUTH_ENABLE === 'true')
            &&
            <SignOutIconButton/>
          }
        </div>
      </div>
    </div>
  );
}
