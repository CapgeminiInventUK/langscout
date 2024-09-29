import { RunCreate, RunUpdate } from 'langsmith/dist/schemas';

export interface CreateTraceRequest extends Omit<RunCreate, 'start_time' | 'end_time'> {
  start_time: string | number;
  end_time?: string | number;
}

export interface CreateTraceDatabase extends Omit<CreateTraceRequest, 'start_time' | 'end_time'> {
  run_id: string;
  start_time: Date;
  end_time?: Date;
}

export interface UpdateTraceRequest extends Omit<RunUpdate, 'start_time' | 'end_time'> {
  start_time: string | number;
  end_time?: string | number;
}

export interface UpdateTraceDatabase extends Omit<UpdateTraceRequest, 'start_time' | 'end_time'> {
  run_id: string;
  start_time: Date;
  end_time?: Date;
}
