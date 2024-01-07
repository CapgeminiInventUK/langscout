import {TracesResponse} from "@/models/traces_response";
import config from "@/utils/config";
import { TraceDetailResponseParent } from '@/models/tree/trace_detail_response_tree';
import { buildTreeFromObject } from '@/utils/buildTreeFromObject';
import { TraceTreeNode } from '@/models/trace_detail_response';

export async function getTraces(): Promise<TracesResponse> {
  const response = await fetch(`${config.langtraceApiUrl}/langtrace/api/traces`);
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
