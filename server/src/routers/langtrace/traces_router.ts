import { Router } from 'express';
import { TraceService } from '../../services/trace_service';

export const tracesRouter = Router();

const traceService = new TraceService();

tracesRouter.get('/', async (req, res) => {
  console.debug('GET /traces');
  try {
    const topLevelTraces = await traceService.getTraces();
    res.json({ 'traces': topLevelTraces });
  } catch (error: unknown) {
    console.error(error);
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    } else {
      return res.status(400).json({ message: 'Unknown error' });
    }
  }
});

tracesRouter.get('/:traceId', async (req, res) => {
  console.debug('GET /traces/:traceId');
  const traceId = req.params.traceId;
  try {
    const trace = await traceService.getTrace(traceId);
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
