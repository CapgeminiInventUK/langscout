import express from 'express';
import { tracesRouter } from './routers/langtrace/traces_router';
import 'dotenv/config';
import qs from 'qs';

const ingest_server = express();
ingest_server.use(express.json());

ingest_server.set('query parser', function (str: string) {
  return qs.parse(str);
});

ingest_server.use('/langtrace/api/traces', tracesRouter);

const PORT = process.env.PORT || 1994;
ingest_server.listen(PORT, () => {
  console.info(`Langtrace server is running on port ${PORT}`);
});
