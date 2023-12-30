import {TraceDetailResponse} from "@/models/trace_detail_response";
import {TracesResponse} from "@/models/traces_response";
import config from "@/utils/config";

export async function getTraces(): Promise<TracesResponse> {
  const response = await fetch(`${config.langtraceApiUrl}/langtrace/api/traces`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data as TracesResponse;
}

export async function getTraceData(traceId: string): Promise<TraceDetailResponse> {
  const response = await fetch(`${config.langtraceApiUrl}/langtrace/api/traces/${traceId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data as TraceDetailResponse;
}
