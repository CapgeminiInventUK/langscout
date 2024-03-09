export interface TraceData {
  id?: string;
  run_id?: string;
  start_time: string | Date; //TODO Handle epoch numbers from Javascript
  end_time?: string | Date; //TODO Handle epoch numbers from Javascript

  [key: string]: unknown;
}
