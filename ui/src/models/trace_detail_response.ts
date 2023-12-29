export interface TraceDetailResponse {
  run_id: string;
  name: string;
  start_time: string;
  end_time: string;
  output: Map<string, any>;
  input: Map<string, any>;
  session_name: string;
  run_type: string;
  parent_run_id: string;
  children: TraceDetailResponse[];
}
