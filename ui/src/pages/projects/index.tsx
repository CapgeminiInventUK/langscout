import React from 'react';
import { getProjects } from '@/services/projects-service';
import Panel from '@/components/Panel';
import OutlineButton from '@/components/OutlineButton';
import AppBar from '@/components/AppBar';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: undefined },
];

interface ProjectsProps {
  projects: string[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return <div>
    <AppBar breadcrumbItems={breadcrumbItems}/>
    <h1>Projects</h1>
    <Panel>
      {projects.map((project, index) => (
        <p key={index}>
          <OutlineButton key={index} href={`/projects/${project}`}>
            {project}
          </OutlineButton>
        </p>
      ))}
    </Panel>
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
