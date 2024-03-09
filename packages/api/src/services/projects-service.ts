import { MongodbRepository } from '../repositories/mongodb-repository';
import { Document } from 'bson';

export class ProjectsService {
  private repository: MongodbRepository;

  constructor() {
    this.repository = new MongodbRepository();
  }

  async getProjects(): Promise<Document[]> {
    return await this.repository.getProjects();
  }
}
