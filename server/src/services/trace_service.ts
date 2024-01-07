import { LangtraceRepository } from '../repositories/langtrace_repository';
import { TraceDetailResponse } from '../models/trace_detail_response';
import { Document } from 'bson';

export class TraceService {
  private repository: LangtraceRepository;

  constructor() {
    this.repository = new LangtraceRepository();
  }

  async getTopLevelTraces(): Promise<TraceDetailResponse[]> {
    return await this.repository.getTraces();
  }

  async getTraceTreeByRunId(traceId: string): Promise<Document | null> {
    const array = await this.repository.getTraceTreeById(traceId);
    if (!array) {
      return null;
    } else if (array.length > 1) {
      throw new Error('Trace not found');
    } else if (array.length == 0) {
      return null;
    } else {
      return array[0];
    }
  }
}
