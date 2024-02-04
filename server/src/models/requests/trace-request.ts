export interface TraceData {
  id?: string;
  run_id?: string;
  start_time: string | Date;
  end_time?: string | Date;

  [key: string]: unknown;
}
