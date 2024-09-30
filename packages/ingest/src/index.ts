import express from 'express';
import { langchainIngestRouter } from './routers/ingest-router';
import 'dotenv/config';
import { feedbackRouter } from './routers/feedback-router';
import { infoRouter } from './routers/info-router';
// import audit from 'express-requests-logger';

const ingestServer = express();
// ingestServer.use(audit(
//   {
//     doubleAudit: true,
//   }
// ));

ingestServer.use(express.json({ limit: '50mb' }));
ingestServer.use('/api/runs', langchainIngestRouter);
ingestServer.use('/api/feedback', feedbackRouter);
ingestServer.use('/api/info', infoRouter);

const PORT = process.env.PORT || 1984;
ingestServer.listen(PORT, () => {
  console.info(`Ingest server is running on port ${PORT}`);
});
