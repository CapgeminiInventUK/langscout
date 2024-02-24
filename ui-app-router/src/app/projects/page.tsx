import { Card, CardContent } from '@/components/ui/card';
import React from 'react';
import { ProjectResponse } from '@/models/responses/projects-response';
import { getProjects } from '@/services/projects-service';
import ProjectsTable from '@/components/projects/projects-table';

interface ProjectsProps {
  projects: ProjectResponse[];
}

const Projects: React.FC<ProjectsProps> = async () => {
  const projects = await getProjects();

  return <>
    <Card>
      <CardContent className={'px-0 pb-0'}>
        <ProjectsTable projects={projects}/>
      </CardContent>
    </Card>
  </>;
};

export default Projects;
