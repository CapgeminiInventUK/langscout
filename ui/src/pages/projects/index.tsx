import React from 'react';
import { getProjects } from '@/services/projects_service';
import Breadcrumb from '@/components/Breadcrumb';
import Link from 'next/link';
import Panel from '@/components/Panel';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Projects', path: undefined },
];

interface ProjectsProps {
  projects: string[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return <div>
    <Breadcrumb items={breadcrumbItems}/>

    <h1>Projects</h1>
    <Panel>
      <ul>
        {projects.map((project, index) => (
          <p key={index}><Link key={index} href={`/projects/${project}`}>{project}</Link></p>
        ))}
      </ul>
    </Panel>
  </div>;
};

export async function getServerSideProps() {
  console.log('Fetching projects');
  const data = await getProjects();
  console.log(data);

  return {
    props: {
      projects: data,
    }
  };
}


export default Projects;
