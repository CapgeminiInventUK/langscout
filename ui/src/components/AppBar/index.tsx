import { BreadcrumbItem } from '@/components/Breadcrumb/props';
import Breadcrumb from '@/components/Breadcrumb';
import React from 'react';
import { MdLogout } from 'react-icons/md';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

interface AppBarProps {
  breadcrumbItems: BreadcrumbItem[];
}

const AppBar: React.FC<AppBarProps> = ({ breadcrumbItems }) => {
  const { status } = useSession();

  return (
    <div className="border-b">
      <div className="flex h-12 items-center px-4">
        {
          breadcrumbItems.length === 0 && <h1 className="text-2xl font-semibold">LangTrace</h1> }
        {breadcrumbItems.length >= 1 && <Breadcrumb items={breadcrumbItems}/>}
        {status === 'authenticated' &&
          <Button variant="outline" size="icon" onClick={() => signOut()}
            className="ml-auto flex items-center space-x-4">
            <MdLogout/>
          </Button>
        }
      </div>
    </div>
  );
};

export default AppBar;
