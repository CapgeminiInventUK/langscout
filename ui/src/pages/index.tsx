import { RiLoginBoxLine } from 'react-icons/ri';
import { signIn, useSession } from 'next-auth/react';
import AppBar from '@/components/AppBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import React from 'react';
import Link from 'next/link';
import { BarChartIcon, GearIcon, StackIcon } from '@radix-ui/react-icons';

const Home = () => {
  const { status } = useSession();

  const quickLinks = [
    {
      name: 'CapGPT Production',
      url: '/projects/capgpt-production/traces'
    },
    {
      name: 'CapGPT Dev',
      url: '/projects/capgpt-dev/traces'
    },
    {
      name: 'CapGPT Local',
      url: '/projects/capgpt-local/traces'
    },
  ];


  if (status === 'loading') {
    return <p>Hang on there...</p>;
  }
  if (status === 'authenticated') {
    return (
      <div>
        <AppBar breadcrumbItems={[]}/>
        <div className="px-4 pt-4">
          <div className="flex gap-4">
            <div className="w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center">
                    <div className="flex flex-col space-y-2">
                      <Link className={buttonVariants({ variant: 'outline' })} href="/projects">
                        <StackIcon className="mr-2 h-4 w-4"/>Projects
                      </Link>
                      <Link className={buttonVariants({ variant: 'outline' })} href="/settings">
                        <GearIcon className="mr-2 h-4 w-4"/>Settings
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="w-1/3">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Launch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid w-full items-center">
                    <div className="flex flex-col space-y-2">
                      {quickLinks.map((link, index) => (
                        <Link key={index} className={buttonVariants({ variant: 'outline' })}
                          href={link.url}>
                          <BarChartIcon className="mr-2 h-4 w-4"/>{link.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>LangTrace</CardTitle>

          </CardHeader>
          <CardContent>
            View your Langchain data
            <Button onClick={() => signIn('github')}>
              <RiLoginBoxLine className="mr-2 h-4 w-4"/> Sign in
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Home;
