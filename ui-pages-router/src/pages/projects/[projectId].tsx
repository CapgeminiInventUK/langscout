import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { getParentPageFromUrlPath } from '@/lib/utils/get-parent-page-from-url-path';
import { usePathname } from 'next/navigation';
import AppBar from '@/components/AppBar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

interface ProjectDetailsPageProps {
  projectId: string;
}

const ProjectDetailsPage: React.FC<ProjectDetailsPageProps> = ({ projectId }) => {
  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: getParentPageFromUrlPath(usePathname()) },
    { name: `${projectId}`, path: undefined }
  ];

  return <>
    <AppBar breadcrumbItems={breadcrumbItems}/>
    <div className="py-4 px-4">
      <Card>
        <CardHeader>
          <CardTitle>{projectId}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center">
            <div className="flex flex-col space-y-0">
              <Link className={buttonVariants({ variant: 'outline' })}
                href={`/projects/${projectId}/traces`}>Traces</Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </>
  ;
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const projectId = context.params?.projectId as string;

    return { props: { projectId } };
  } catch (error) {
    return { props: { error: 'Failed to fetch trace data' } };
  }
}

export default ProjectDetailsPage;
