import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { BarChartIcon, GearIcon, StackIcon } from '@radix-ui/react-icons';


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

export const metadata = {
  title: 'Langtrace',
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    return <>
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
    </>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardFooter>
        <Link className={buttonVariants({ variant: 'default' })}
          href={'/api/auth/signin'}>
          Sign in
        </Link>
      </CardFooter>
    </Card>

  );
}
