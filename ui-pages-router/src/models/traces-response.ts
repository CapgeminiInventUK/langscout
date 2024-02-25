import { TraceTreeNode } from '@/models/trace-detail-response';

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
