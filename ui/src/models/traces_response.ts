import {TraceTreeNode} from "@/models/trace_detail_response";

export interface TracePercentile {
  percentile: number;
  latency: number;
}

export interface TracesResponse {
  traces: TraceTreeNode[];
  latency_percentiles: TracePercentile[];
}
