import { getServerSession } from 'next-auth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { BarChartIcon, StackIcon } from '@radix-ui/react-icons';
import { authOptions } from '@/lib/utils/auth-options';

export const metadata = {
  title: 'Langscout',
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  // TODO Replace with a proper API call to get distinct projects. See #182
  const linksString = process.env.QUICK_LINKS!;
  const quickLinks = JSON.parse(linksString) as { name: string, url: string }[];

  if (session || process.env.NEXTAUTH_ENABLE !== 'true') {
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
