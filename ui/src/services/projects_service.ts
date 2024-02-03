import config from '@/lib/utils/config';


export async function getProjects(): Promise<string[]> {
  try {
    console.log('getProjects');
    const response = await fetch(`${config.langtraceApiUrl}/langtrace/api/projects`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    return data as string[];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
