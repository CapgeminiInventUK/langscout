
import { Run } from 'langsmith/schemas';

//TODO Rename
export interface TraceData extends Omit<Run, 'child_runs'>{
  run_id: string;
  latency: number | null;
  totalInputTokenCount?: number;
  totalInputCost?: number;
  totalOutputCost?: number;
  totalOutputTokenCount?: number;
  totalCost?: number;
  totalTokens?: number;
  depth?: number;

  child_runs: TraceData[]; // Override so that it has the extra fields
}
