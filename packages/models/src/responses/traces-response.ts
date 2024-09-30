import { TraceData } from './trace-data';
import { TracePercentile } from './traces-percentiles-response';
import { FeedbackCountResponse } from './feedback-count-response';

export interface TracesResponse {
  traces: TraceData[];
  latency_percentiles: TracePercentile[];
  feedback_counts: FeedbackCountResponse[];
}
