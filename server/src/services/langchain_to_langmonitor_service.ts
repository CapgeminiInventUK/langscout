import { LangmonitorRepository } from '../repositories/langmonitor_repository';
import { TraceData } from '../models/requests/trace_request';

export class LangchainToLangmonitorService {
  private langmonitorRepository: LangmonitorRepository;

  constructor() {
    this.langmonitorRepository = new LangmonitorRepository();
  }

  private convertToDates(data: TraceData): void {
    if (data.start_time) {
      data.start_time = new Date(data.start_time);
    }
    if (data.end_time) {
      data.end_time = new Date(data.end_time);
    }
  }

  async createTrace(langchainData: TraceData): Promise<string> {
    if (!langchainData.id) {
      throw new Error('id is required in data');
    }
    langchainData.run_id = langchainData.id;
    delete langchainData.id;

    this.convertToDates(langchainData);

    await this.langmonitorRepository.insertTrace(langchainData);
    return langchainData.run_id;
  }

  async updateTrace(trace_id: string, langchainData: TraceData): Promise<boolean> {
    this.convertToDates(langchainData);

    const updateResult = await this.langmonitorRepository.updateTrace(trace_id, langchainData);
    return updateResult.matchedCount > 0;
  }
}
