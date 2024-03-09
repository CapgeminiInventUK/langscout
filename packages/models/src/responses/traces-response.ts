import { TraceDetailResponse } from './trace-detail-response';
import { TracePercentile } from './traces-percentiles-response';
import { FeedbackCountResponse } from './feedback-count-response';

export interface TracesResponse {
  traces: TraceDetailResponse[];
  latency_percentiles: TracePercentile[];
  feedback_counts: FeedbackCountResponse[];
}
