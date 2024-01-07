import { TracesResponse } from '@/models/traces_response';
import config from '@/utils/config';
import { TraceDetailResponseParent } from '@/models/tree/trace_detail_response_tree';
import { buildTreeFromObject } from '@/utils/buildTreeFromObject';
import { TraceTreeNode } from '@/models/trace_detail_response';

export async function getTraces(startDate?: string, endDate?: string): Promise<TracesResponse> {
  let url = `${config.langtraceApiUrl}/langtrace/api/traces`;
  const queryParams = new URLSearchParams();
  if (startDate && startDate.trim() !== '') {
    queryParams.append('startDate', startDate);
  }
  if (endDate && endDate.trim() !== '') {
    queryParams.append('endDate', endDate);
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


export async function getTraceTree(traceId: string): Promise<TraceTreeNode> {
  const response = await fetch(`${config.langtraceApiUrl}/langtrace/api/traces/tree/${traceId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();

  return buildTreeFromObject(data as TraceDetailResponseParent);
}
