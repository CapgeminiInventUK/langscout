export interface TraceDetailResponse {
  run_id: string;
  name: string;
  start_time: string;
  end_time: string;
  outputs: { [key: string]: any };
  inputs: { [key: string]: any };
  session_name: string;
  run_type: string;
  latency: number;
  parent_run_id: string;
  children: TraceDetailResponse[];
}
