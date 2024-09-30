import { TraceData } from '@langscout/models';

export interface TracePercentile {
  percentile: number;
  latency: number;
}

export interface FeedbackCount {
  key: string;
  counts: { [key: string]: number };
}


export interface TracesResponse {
  traces: TraceData[];
  latency_percentiles: TracePercentile[];
  feedback_counts: FeedbackCount[];
}
