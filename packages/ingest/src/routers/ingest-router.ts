import { Router, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { LangchainToLangscoutService } from '../services/langchain-to-langscout-service';
import { sleepBeforeRetry } from '../utils/sleep-before-retry';
import { BatchTraceRequest, CreateTraceRequest, UpdateTraceRequest } from '@langscout/models';

const router = Router();
const langchainService = new LangchainToLangscoutService();

router.post('/batch', async (req: ExpressRequest<never, never, BatchTraceRequest>,
  res: ExpressResponse) => {

  console.debug('POST /api/runs/batch');

  if (req.body.post) {
    for (const record of req.body.post) {
      try {
        const runId = await langchainService.createTrace(record);
        console.debug(`Created run with id ${runId}`);
      } catch (error) {
        console.error(`Error creating run: ${error}`);
      }
    }
  } else if (req.body.patch) {
    for (const record of req.body.patch) {
      try {
        const runId = record.id!;
        const success = await langchainService.updateTrace(runId, record);
        console.debug(`Updated run with id ${runId} with success: ${success}`);
      } catch (error) {
        console.error(`Error updating run: ${error}`);
      }
    }
  }

  res.status(200).json({ message: 'Batch request processed' });
});

router.post('/', async (req: ExpressRequest<never, never, CreateTraceRequest>,
  res: ExpressResponse) => {
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

router.patch('/:runId', async (req: ExpressRequest<{
  runId: string
}, never, UpdateTraceRequest>, res: ExpressResponse) => {
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
