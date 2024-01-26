import { TraceDetailResponse } from './trace_detail_response';
import { TracePercentile } from './traces_percentiles';
import { FeedbackCountResponse } from './feedback_count_response';

export interface TracesResponse {
  traces: TraceDetailResponse[];
  latency_percentiles: TracePercentile[];
  feedback_counts: FeedbackCountResponse[];
}
