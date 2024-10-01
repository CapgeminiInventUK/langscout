import { Request as ExpressRequest, Response as ExpressResponse, Router } from 'express';
import { ProjectsService } from '../services/projects-service';
import { tracesRouter } from './traces-router';

export const projectsRouter = Router();

const projectsService = new ProjectsService();

projectsRouter.use('/', tracesRouter);

projectsRouter.get('/', async (req: ExpressRequest, res: ExpressResponse) => {
  console.debug('GET /projects');

  const projects = await projectsService.getProjects();

  return res.json(projects);
});

