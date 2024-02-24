import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { getProjects } from '@/services/projects-service';
import ProjectsTable from '@/components/projects/projects-table';

export const metadata = {
  title: 'Langtrace - Projects',
};

export default async function Projects() {
  const projects = await getProjects();
  return <>
    <Card>
      <CardContent className={'px-0 pb-0'}>
        <ProjectsTable projects={projects}/>
      </CardContent>
    </Card>
  </>;
};
