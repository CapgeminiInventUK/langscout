import { Router, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { LangchainToLangtraceService } from '../../services/langchain_to_langtrace_service';
import { CreateFeedback, UpdateFeedback } from '../../models/requests/feedback_request';

export const langchainFeedbackRouter = Router();
const langchainService = new LangchainToLangtraceService();

langchainFeedbackRouter.post('/', async (req: ExpressRequest, res: ExpressResponse) => {
  console.debug('POST /api/feedback');
  try {
    const runData = req.body as CreateFeedback;
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

langchainFeedbackRouter.patch('/:feedbackId', async (req: ExpressRequest, res: ExpressResponse) => {
  console.debug('PATCH /api/feedback/:feedbackId');
  const feedbackId = req.params.feedbackId;
  const updateData = req.body as UpdateFeedback;

  const success = await langchainService.updateFeedback(feedbackId, updateData);
  if (!success) {
    return res.status(404).json({ message: 'Feedback not found or update failed' });
  }
  return res.status(204).send();
});
