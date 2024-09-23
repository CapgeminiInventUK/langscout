import config from '@/lib/utils/config';
import { ProjectResponse } from '@/models/responses/projects-response';

export async function getProjects(): Promise<ProjectResponse[]> {
  try {
    const response = await fetch(`${config.langscoutApiUrl}/langscout/api/projects`);

    if (!response.ok) {
      console.error(response);
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    return data as ProjectResponse[];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
