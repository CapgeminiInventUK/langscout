export interface TraceTreeNode {
  run_id: string;
  name: string;
  start_time: string;
  end_time: string;
  outputs: { [key: string]: any };
  inputs: { [key: string]: any };
  error: string | null
  session_name: string;
  run_type: string;
  latency: number;
  parent_run_id: string;
  children: TraceTreeNode[];
  execution_order?: number;
  depth?: number;
  feedback?: { [key: string]: any }; //TODO Make this a proper type
}
