import { CreateFeedback } from '../requests/feedback-request';

export interface TraceDetailResponse {
  run_id: string;
  name: string;
  start_time: string;
  end_time: string;
  latency: number | null;
  metadata: Map<string, unknown>;
  output: Map<string, unknown>;
  input: Map<string, unknown>;
  session_name: string;
  run_type: string;
  execution_order: number | null;
  error: string | null;
  trace_id: string | null;
  dotted_order: string | null;
  parent_run_id: string | null;
  children: TraceDetailResponse[];
  feedback?: CreateFeedback;
}
