import { Router, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { LangchainToLangmonitorService } from '../../services/langchain_to_langmonitor_service';
import { sleepBeforeRetry } from '../../utils/sleepBeforeRetry';

export const langchainIngestRouter = Router();
const langchainService = new LangchainToLangmonitorService();

langchainIngestRouter.post('/', async (req: ExpressRequest, res: ExpressResponse) => {
  console.debug('POST /api/runs');
  try {
    const runData = req.body;
    const runId = await langchainService.createTrace(runData);
    console.debug(`Created run with id ${runId}`);
    res.status(201).json();
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

langchainIngestRouter.patch('/:runId', async (req: ExpressRequest, res: ExpressResponse) => {
  console.debug('PATCH /api/runs/:runId');
  const runId = req.params.runId;
  const updateData = req.body;

  let success = false;
  let attempts = 0;
  const maxAttempts = 3;
  const retryInterval = 3000; // 3 seconds

  while (!success && attempts < maxAttempts) {
    try {
      success = await langchainService.updateTrace(runId, updateData);

      if (!success) {
        attempts++;
        if (attempts < maxAttempts) {
          await sleepBeforeRetry(retryInterval);
        } else {
          return res.status(404).json({ message: 'Run not found or update failed' });
        }
      } else {
        return res.status(204).send();
      }
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
});

export default langchainIngestRouter;
