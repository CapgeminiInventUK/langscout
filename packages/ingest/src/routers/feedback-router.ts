import { Router, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { LangchainToLangscoutService } from '../services/langchain-to-langscout-service';
import { CreateFeedback, UpdateFeedback } from '@langscout/models';

export const feedbackRouter = Router();
const langchainService = new LangchainToLangscoutService();

feedbackRouter.post('/', async (
  req: ExpressRequest<never, never, CreateFeedback>,
  res: ExpressResponse) => {
  console.debug('POST /api/feedback');
  try {
    const runData = req.body;
    if (!runData.run_id) {
      return res.status(400).json({ message: 'run_id is required' });
    }

    // Default feedbacl id to the run_id
    if(!runData.id){
      runData.id = runData.run_id;
    }
    await langchainService.createFeedback(runData);
    console.debug(`Created feedback with id ${runData.id} in run ${runData.run_id}`);

    res.status(201).json(
      { feedback_id: runData.id }
    );
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: 'Unknown error' });
    }
  }
});

feedbackRouter.patch('/:feedbackId', async (req: ExpressRequest<{
  feedbackId: string
}, never, UpdateFeedback>, res: ExpressResponse) => {
  console.debug('PATCH /api/feedback/:feedbackId');
  const feedbackId = req.params.feedbackId;
  const updateData = req.body;

  const success = await langchainService.updateFeedback(feedbackId, updateData);
  if (!success) {
    return res.status(404).json({ message: 'Feedback not found or update failed' });
  }
  return res.status(204).send();
});
