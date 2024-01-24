export interface TraceDetailResponseParent {
  run_id: string;
  name: string;
  error: string | null;
  start_time: string;
  end_time: string;
  execution_order: number;
  outputs: { [key: string]: any };
  inputs: { [key: string]: any };
  session_name: string;
  run_type: string;
  latency: number;
  parent_run_id: string;
  children: TraceDetailResponseChild[];
}

export interface TraceDetailResponseChild {
  depth: number;
  run_id: string;
  execution_order: number;
  error: string | null;
  name: string;
  start_time: string;
  end_time: string;
  outputs: { [key: string]: any };
  inputs: { [key: string]: any };
  session_name: string;
  run_type: string;
  latency: number;
  parent_run_id: string;
  children?: TraceDetailResponseChild[];

}
