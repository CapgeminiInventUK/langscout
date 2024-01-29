import { Router } from 'express';
import { TraceService } from '../../services/trace_service';

export const tracesRouter = Router();

const traceService = new TraceService();

export interface FeedbackFilters {
  [key: string]: string[];
}

tracesRouter.get('/', async (req, res) => {
  console.debug('GET /traces');
  try {
    const { startDate, endDate,  feedbackFilter } = req.query;

    let start, end, filters;

    if (startDate) {
      start = new Date(startDate as string);
      if (isNaN(start.getTime())) {
        throw new Error('Invalid startDate');
      }
    }

    if (endDate) {
      end = new Date(endDate as string);
      if (isNaN(end.getTime())) {
        throw new Error('Invalid endDate');
      }

      if (!startDate) {
        throw new Error('startDate is required if endDate is provided');
      }
    }

    if (feedbackFilter) {
      try {
        console.log(feedbackFilter);
        filters = feedbackFilter as FeedbackFilters;
      } catch (error) {
        console.error('Failed to parse feedbackFilters', error);
      }
    }

    const topLevelTraces = await traceService.getTopLevelTraces(start, end, filters);
    res.json(topLevelTraces);
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: 'Unknown error' });
    }
  }
});

tracesRouter.get('/tree/:traceId', async (req, res) => {
  console.debug(`GET /traces/tree/${req.params.traceId}`);
  const traceId = req.params.traceId;
  try {
    const trace = await traceService.getTraceTreeByRunId(traceId);
    if (!trace) {
      return res.status(404).json({ message: 'Trace not found' });
    }
    return res.json( trace );
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: 'Unknown error' });
    }
  }
});
