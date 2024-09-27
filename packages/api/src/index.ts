import express from 'express';
import 'dotenv/config';
import qs from 'qs';
import { projectsRouter } from './routers/project-router';

const ingest_server = express();
ingest_server.use(express.json());

ingest_server.set('query parser', function (str: string) {
  return qs.parse(str);
});

ingest_server.use('/langscout/api/projects', projectsRouter);

const PORT = process.env.PORT || 1994;
ingest_server.listen(PORT, () => {
  console.info(`Langscout server is running on port ${PORT}`);
});
