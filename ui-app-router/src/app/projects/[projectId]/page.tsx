import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function ProjectPage({ params }:
  {
    params: {
      projectId: string
    }
  }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{params.projectId}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center">
          <div className="flex flex-col space-y-0">
            <Link className={buttonVariants({ variant: 'outline' })}
                  href={`/projects/${params.projectId}/traces`}>Traces</Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
