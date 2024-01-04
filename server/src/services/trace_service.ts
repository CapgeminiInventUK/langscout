import { LangtraceRepository } from '../repositories/langtrace_repository';
import { TraceDetailResponse } from '../models/trace_detail_response';

export class TraceService {
  private repository: LangtraceRepository;

  constructor() {
    this.repository = new LangtraceRepository();
  }

  private async fetchChildren(topLevelTraceId: string): Promise<TraceDetailResponse[]> {
    const children = await this.repository.getChildrenForParentRunId(topLevelTraceId);
    for (const child of children) {
      this.addLatencyIfMissing(child);
      child.children = await this.fetchChildren(child.run_id);
    }

    return children;
  }

  async getTopLevelTraces(): Promise<TraceDetailResponse[]> {
    const topLevelTraces = await this.repository.getTraces();

    for (const trace of topLevelTraces) {
      // This should happen in the database, but it's not happening for some reason
      // we'll do it here
      this.addLatencyIfMissing(trace);
    }
    return topLevelTraces;
  }

  private addLatencyIfMissing(trace: TraceDetailResponse) {
    if (trace.latency === null) {
      console.warn(`Trace ${trace.run_id} is missing latency, will calculate now`);
      const startTime = new Date(trace.start_time);
      const endTime = trace.end_time ? new Date(trace.end_time) : null;
      if (endTime) {
        console.debug(`Trace ${trace.run_id} has end_time, calculating latency`);
        trace.latency = endTime.getTime() - startTime.getTime();
      } else {
        console.error(`Trace ${trace.run_id} is missing end_time, cannot calculate latency`);
      }
    }
  }

  async getTrace(traceId: string): Promise<TraceDetailResponse> {
    const topLevelRun = await this.repository.getTraceByRunId(traceId);
    if (!topLevelRun) {
      throw new Error('Trace not found');
    }
    this.addLatencyIfMissing(topLevelRun);
    topLevelRun.children = await this.fetchChildren(traceId);
    return topLevelRun;
  }

}

