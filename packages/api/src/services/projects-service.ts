import { MongodbRepository } from '../repositories/mongodb-repository';
import { ProjectResponse } from '@langscout/models';

export class ProjectsService {
  private repository: MongodbRepository;

  constructor() {
    this.repository = new MongodbRepository();
  }

  async getProjects(): Promise<ProjectResponse[]> {
    return await this.repository.getProjects();
  }
}
