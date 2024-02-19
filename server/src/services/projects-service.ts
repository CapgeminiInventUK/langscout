import { ApiRepository } from '../repositories/api-repository';
import { Document } from 'bson';

export class ProjectsService {
  private repository: ApiRepository;

  constructor() {
    this.repository = new ApiRepository();
  }

  async getProjects(): Promise<Document[]> {
    return await this.repository.getProjects();
  }
}
