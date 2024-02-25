export interface TraceTreeNode {
  run_id: string;
  name: string;
  start_time: string;
  end_time: string | null;
  metadata: { [key: string]: any };
  outputs: { [key: string]: any };
  inputs: { [key: string]: any };
  error: string | null;
  session_name: string;
  run_type: string;
  latency: number;
  parent_run_id: string;
  children: TraceTreeNode[];
  totalInputTokenCount?: number;
  totalInputCost?: number;
  totalOutputCost?: number;
  totalOutputTokenCount?: number;
  totalCost?: number;
  totalTokens?: number;
  depth?: number;
  feedback?: { [key: string]: any }; //TODO Make this a proper type
  execution_order?: number; // (<= langsmith-sdk v0.0.90)
  trace_id?: string; // (>= langsmith-sdk v0.0.90)
  dotted_order?: string; // (>= langsmith-sdk v0.0.90)

}
