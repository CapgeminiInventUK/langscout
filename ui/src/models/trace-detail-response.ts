export interface TraceTreeNode {
  run_id: string;
  name: string;
  start_time: string;
  end_time: string;
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

  execution_order?: number; //TODO This is only used for old format (pre version....)

  trace_id?: string; //TODO This is only used for new format (post version....)
  dotted_order?: string; //TODO This is only used for new format (post version....)

}
