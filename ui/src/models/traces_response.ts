import {TraceTreeNode} from "@/models/trace_detail_response";

export interface TracePercentile {
  percentile: number;
  latency: number;
}

export interface FeedbackCount {
  key: string;
  counts: { [key: string]: number };
}


export interface TracesResponse {
  traces: TraceTreeNode[];
  latency_percentiles: TracePercentile[];
  feedback_counts: FeedbackCount[];
}
