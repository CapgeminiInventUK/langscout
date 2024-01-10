import { TraceDetailResponse } from './trace_detail_response';
import { TracePercentile } from './traces_percentiles';

export interface TracesResponse {
  traces: TraceDetailResponse[];
  latency_percentiles: TracePercentile[];
}
