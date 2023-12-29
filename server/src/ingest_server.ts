import express from 'express';
import { langchainIngestRouter } from './routers/ingest/langchain_ingestion_router';

const ingest_server = express();
ingest_server.use(express.json({ limit: '50mb' }));
ingest_server.use('/api/runs', langchainIngestRouter);

const PORT = process.env.PORT || 1984;
ingest_server.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`);
});
