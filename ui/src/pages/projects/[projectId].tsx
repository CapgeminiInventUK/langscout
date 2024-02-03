import { GetServerSidePropsContext } from 'next';
import React from 'react';
import Link from 'next/link';
import { getParentPageFromUrlPath } from '@/lib/utils/getParentPageFromUrlPath';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Panel from '@/components/Panel';

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
    <Breadcrumb items={breadcrumbItems}/>
    <div>
      <h1>{projectId}</h1>
      <Panel>
        <Link href={`/projects/${projectId}/traces`}>Traces</Link>
      </Panel>
    </div>
  </>;
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
