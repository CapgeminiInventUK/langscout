import { TraceTreeNode } from '@/models/responses/trace-detail-response';

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
