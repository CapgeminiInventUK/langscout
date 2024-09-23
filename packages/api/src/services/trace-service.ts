import { Document } from 'bson';
import { TracesResponse } from '@langscout/models';
import { MongodbRepository } from '../repositories/mongodb-repository';
import { FeedbackFilters } from '../routers/traces-router';

export class TraceService {
  private repository: MongodbRepository;

  constructor() {
    this.repository = new MongodbRepository();
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
