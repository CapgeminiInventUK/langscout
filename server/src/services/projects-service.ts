import { ApiRepository } from '../repositories/api-repository';

export class ProjectsService {
  private repository: ApiRepository;

  constructor() {
    this.repository = new ApiRepository();
  }

  async getProjects(): Promise<string[]> {
    return await this.repository.getProjects();
  }
}
