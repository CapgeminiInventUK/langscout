import {TraceDetailResponse} from "@/models/trace_detail_response";
import {TracesResponse} from "@/models/traces_response";

export async function getTraces(): Promise<TracesResponse> {
  const response = await fetch('http://localhost:1984/api/traces');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data as TracesResponse;
}

export async function getTraceData(traceId: string): Promise<TraceDetailResponse> {
  const response = await fetch(`http://localhost:1984/api/traces/${traceId}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data as TraceDetailResponse;
}
