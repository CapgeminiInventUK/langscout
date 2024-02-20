import React from 'react';
import { getProjects } from '@/services/projects-service';
import AppBar from '@/components/AppBar';
import { ProjectResponse } from '@/models/projects-response';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: undefined },
];

interface ProjectsProps {
  projects: ProjectResponse[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {

  const handleRowClick = (url: string) => {
    window.location.href = url;
  };


  return <>
    <AppBar breadcrumbItems={breadcrumbItems}/>
    <div className="py-4 px-4">
      <Card>
        <CardContent className={'px-0 pb-0'}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Traces 24h</TableHead>
                <TableHead>Traces 7d</TableHead>
                <TableHead>Traces 30d</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project, index) => (
                <TableRow key={index}
                  onClick={() => handleRowClick(`/projects/${project.project_name}`)}>
                  <TableCell>{project.project_name}</TableCell>
                  <TableCell>{project.tracesLast24Hours}</TableCell>
                  <TableCell>{project.tracesLast7Days}</TableCell>
                  <TableCell>{project.tracesLast30Days}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  </>;
};

export async function getServerSideProps() {
  return {
    props: {
      projects: await getProjects(),
    }
  };
}


export default Projects;
