import express from 'express';
import { langchainIngestRouter } from './routers/ingest/langchain-ingestion-router';
import 'dotenv/config';
import { langchainFeedbackRouter } from './routers/ingest/langchain-feedback-router';



const ingestServer = express();
ingestServer.use(express.json({ limit: '50mb' }));
ingestServer.use('/api/runs', langchainIngestRouter);
ingestServer.use('/api/feedback', langchainFeedbackRouter);

const PORT = process.env.PORT || 1984;
ingestServer.listen(PORT, () => {
  console.info(`Ingest server is running on port ${PORT}`);
});
