import { Router, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { LangchainToLangscoutService } from '../services/langchain-to-langscout-service';
import { sleepBeforeRetry } from '../utils/sleep-before-retry';

const router = Router();
const langchainService = new LangchainToLangscoutService();

// Updated /batch route
router.post('/batch', (req, res) => {
  console.debug('POST /api/runs/batch');

  if (typeof req.body === 'object' && req.body !== null) {
    const keys = Object.keys(req.body);
    keys.forEach(async (key) => {
      if (key === 'post') {
        if (Array.isArray(req.body[key])) {
          for (const record of req.body[key]) {
            try {
              const runId = await langchainService.createTrace(record);
              console.debug(`Created run with id ${runId}`);
            } catch (error) {
              console.error(`Error creating run: ${error}`);
            }
          }
        }
      } else if (key === 'patch') {
        if (Array.isArray(req.body[key])) {
          for (const record of req.body[key]) {
            try {
              const runId = record.id;
              const success = await langchainService.updateTrace(runId, record);
              console.debug(`Updated run with id ${runId} with success: ${success}`);
            } catch (error) {
              console.error(`Error updating run: ${error}`);
            }
          }
        }
      } else {
        console.error(`Invalid key: ${key}`);
      }
    });
  } else {
    console.error('Received data is neither an array nor a JSON object');
  }

  res.status(200).json({ message: 'Batch request processed' });
});

router.post('/', async (req: ExpressRequest, res: ExpressResponse) => {
  console.debug('POST /api/runs');
  try {
    const runData = req.body;
    const runId = await langchainService.createTrace(runData);
    console.debug(`Created run with id ${runId}`);
    res.status(201).json();
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: 'Unknown error' });
    }
  }
});

router.patch('/:runId', async (req: ExpressRequest, res: ExpressResponse) => {
  console.debug('PATCH /api/runs/:runId');
  const runId = req.params.runId;
  const updateData = req.body;

  let success = false;
  let attempts = 0;
  const maxAttempts = 3;
  const retryIntervalMs = 3000;

  while (!success && attempts < maxAttempts) {
    try {
      success = await langchainService.updateTrace(runId, updateData);

      if (!success) {
        attempts++;
        if (attempts < maxAttempts) {
          await sleepBeforeRetry(retryIntervalMs);
        } else {
          return res.status(404).json({ message: 'Run not found or update failed' });
        }
      } else {
        return res.status(204).send();
      }
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      } else {
        return res.status(400).json({ message: 'Unknown error' });
      }
    }
  }
});

export const langchainIngestRouter = router;
