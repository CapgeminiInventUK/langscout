import { Document } from 'bson';
import { TracesResponse } from '../models/traces_response';
import { ApiRepository } from '../repositories/api_repository';
import { FeedbackFilters } from '../routers/langtrace/traces_router';

export class TraceService {
  private repository: ApiRepository;

  constructor() {
    this.repository = new ApiRepository();
  }

  async getTopLevelTraces(
    projectId: string,
    startDate?: Date,
    endDate?: Date,
    feedbackFilters?: FeedbackFilters): Promise<TracesResponse> {
    return {
      feedback_counts: await this.repository.getFeedbackCounts(
        projectId,
        startDate,
        endDate
      ),
      latency_percentiles: await this.repository.getLatencyPercentile(
        projectId,
        startDate,
        endDate,
        feedbackFilters
      ),
      traces: await this.repository.getTraces(
        projectId,
        startDate,
        endDate,
        feedbackFilters
      )
    };
  }

  async getTraceTreeByRunId(projectId: string, traceId: string): Promise<Document | null> {
    const array = await this.repository.getTraceTreeById(projectId, traceId);
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
