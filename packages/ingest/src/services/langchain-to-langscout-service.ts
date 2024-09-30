import {
  CreateTraceRequest,
  UpdateTraceRequest,
  CreateFeedback,
  UpdateFeedback, UpdateTraceDatabase, CreateTraceDatabase
} from '@langscout/models';
import { MongodbRepository } from '../repositories/mongodb-repository';

export class LangchainToLangscoutService {
  private repository: MongodbRepository;

  constructor() {
    this.repository = new MongodbRepository();
  }

  private convertToDate(time: number | string): Date {
    return new Date(typeof time === 'number' ? time * 1000 : time);
  }

  async createTrace(langchainData: CreateTraceRequest): Promise<string> {
    if (!langchainData.id) {
      throw new Error('id is required in data');
    }

    const insertData: CreateTraceDatabase = {
      ...langchainData,
      run_id: langchainData.id,
      start_time: this.convertToDate(langchainData.start_time),
      end_time: langchainData.end_time
        ? this.convertToDate(langchainData.end_time)
        : undefined,
    };

    await this.repository.insertTrace(insertData);
    return langchainData.id;
  }

  async updateTrace(traceId: string, langchainData: UpdateTraceRequest): Promise<boolean> {
    if (!langchainData.id) {
      throw new Error('id is required in data');
    }

    const updateData: UpdateTraceDatabase = {
      ...langchainData,
      run_id: langchainData.id,
      end_time: langchainData.end_time
        ? this.convertToDate(langchainData.end_time)
        : undefined,
    };

    const updateResult = await this.repository.updateTrace(traceId, updateData);
    return updateResult.matchedCount > 0;
  }

  async createFeedback(feedback: CreateFeedback) {
    if (!feedback.run_id) {
      throw new Error('run_id is required in data');
    }

    await this.repository.insertFeedbackOnTraceByRunId(
      feedback
    );
    return feedback.id;
  }

  async updateFeedback(feedbackId: string, feedbackData: UpdateFeedback): Promise<boolean> {
    return (
      await this.repository.updateFeedbackOnTraceByFeedbackId(
        feedbackId,
        feedbackData
      )
    ).matchedCount > 0;
  }
}
