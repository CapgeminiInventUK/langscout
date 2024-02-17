import { GetServerSidePropsContext } from 'next';
import React from 'react';
import { getParentPageFromUrlPath } from '@/lib/utils/get-parent-page-from-url-path';
import { usePathname } from 'next/navigation';
import Panel from '@/components/Panel';
import OutlineButton from '@/components/OutlineButton';
import AppBar from '@/components/AppBar';

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
    <div>
      <h1>{projectId}</h1>
      <Panel>
        <OutlineButton href={`/projects/${projectId}/traces`}>Traces</OutlineButton>
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
