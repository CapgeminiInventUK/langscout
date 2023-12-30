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
      child.children = await this.fetchChildren(child.run_id);
    }

    return children;
  }

  async getTraces(): Promise<TraceDetailResponse[]> {
    const topLevelTraces =  await this.repository.getTraces();

    // TODO Move this to happen on ingestion
    for (const trace of topLevelTraces) {
      const startTime = new Date(trace.start_time);
      const endTime = trace.end_time ? new Date(trace.end_time) : null;
      if (endTime){
        trace.latency = endTime.getTime() - startTime.getTime();
      }
    }
    return topLevelTraces;
  }

  async getTrace(traceId: string): Promise<TraceDetailResponse> {
    const topLevelRun =  await this.repository.getTraceByRunId(traceId);
    if (!topLevelRun) {
      throw new Error('Trace not found');
    }
    topLevelRun.children = await this.fetchChildren(traceId);
    return topLevelRun;
  }

}

