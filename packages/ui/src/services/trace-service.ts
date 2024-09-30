import { TracesResponse } from '@/models/responses/traces-response';
import config from '@/lib/utils/config';
import { buildTreeFromObject } from '@/lib/utils/build-tree-from-object';
import { TraceData } from '@langscout/models';

export async function getTraces(
  projectId: string,
  startDate?: string,
  endDate?: string,
  feedbackFilters?: string
): Promise<TracesResponse> {
  let url = `${config.langscoutApiUrl}/langscout/api/projects/${projectId}/traces`;
  const queryParams = new URLSearchParams();
  if (startDate && startDate.trim() !== '') {
    queryParams.append('startDate', startDate);
  }
  if (endDate && endDate.trim() !== '') {
    queryParams.append('endDate', endDate);
  }

  if (feedbackFilters) {
    try {
      const filters = JSON.parse(feedbackFilters);
      if (typeof filters === 'object' && filters !== null) {
        Object.entries(filters).forEach(([key, values]) => {
          if (Array.isArray(values)) {
            values.forEach(value => {
              if (typeof value === 'string') {
                queryParams.append(`feedbackFilter[${key}][]`, value);
              }
            });
          }
        });
      }
    } catch (error) {
      console.error('Failed to parse feedbackFilters', error);
    }
  }


  if (queryParams.toString()) {
    url += `?${queryParams.toString()}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data as TracesResponse;
}


export async function getTraceTree(projectId: string, traceId: string): Promise<TraceData | null> {
  const response = await fetch(
    `${config.langscoutApiUrl}/langscout/api/projects/${projectId}/traces/tree/${traceId}`
  );
  // If 404
  if (response.status === 404) {
    return null;
  }

  if (response.status !== 404 && !response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  return buildTreeFromObject(data as TraceData);
}
