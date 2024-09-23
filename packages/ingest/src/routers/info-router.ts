import express from 'express';

const router = express.Router();

interface BatchIngestConfig {
  scale_up_qsize_trigger?: number;
  scale_up_nthreads_limit?: number;
  scale_down_nempty_trigger?: number;
  size_limit?: number;
  size_limit_bytes?: number | null;
}

interface LangSmithInfo {
  version: string;
  license_expiration_time?: Date;
  batch_ingest_config?: BatchIngestConfig;
}

router.get('/', (req, res) => {
  const info: LangSmithInfo = {
    version: 'langscout-0.0.1',
    batch_ingest_config: {
      scale_up_qsize_trigger: 1000,
      scale_up_nthreads_limit: 10,
      scale_down_nempty_trigger: 5,
      size_limit: 100,
      size_limit_bytes: null, // 1 MB as an example
    },
  };
  res.json(info);
});

export const infoRouter = router;