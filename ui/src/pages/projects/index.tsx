import React from 'react';
import { getProjects } from '@/services/projects-service';
import Panel from '@/components/Panel';
import OutlineButton from '@/components/OutlineButton';
import AppBar from '@/components/AppBar';
import { ProjectResponse } from '@/models/projects-response';
import SimpleTable from '@/components/SimpleTable';

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


  return <div>
    <AppBar breadcrumbItems={breadcrumbItems}/>
    <h1>Projects</h1>
    <SimpleTable>
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Traces 24h</th>
          <th>Traces 7d</th>
          <th>Traces 30d</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => (
          <tr key={index} onClick={() => handleRowClick(`/projects/${project.project_name}`)}>
            <td>{project.project_name}</td>
            <td>{project.tracesLast24Hours}</td>
            <td>{project.tracesLast7Days}</td>
            <td>{project.tracesLast30Days}</td>
          </tr>
        ))}
      </tbody>
    </SimpleTable>
  </div>;
};

export async function getServerSideProps() {
  return {
    props: {
      projects: await getProjects(),
    }
  };
}


export default Projects;
