import { CreateFeedback } from './requests/feedback_request';

export interface TraceDetailResponse {
  run_id: string;
  name: string;
  start_time: string;
  end_time: string;
  latency: number | null;
  output: Map<string, unknown>;
  input: Map<string, unknown>;
  session_name: string;
  run_type: string;
  parent_run_id: string | null;
  children: TraceDetailResponse[];
  feedback?: CreateFeedback;
}
