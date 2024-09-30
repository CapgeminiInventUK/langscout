import { TraceService } from './trace-service';
import { TraceData, TracesResponse, TracePercentile } from '@langscout/models';
import { MongodbRepository } from '../repositories/mongodb-repository';

jest.mock('../repositories/mongodb-repository');

describe('TraceService', () => {
  let service: TraceService;
  let mockRepository: jest.Mocked<MongodbRepository>;

  const mockProjectId = 'projectId';

  beforeEach(() => {
    mockRepository = new MongodbRepository() as any;
    service = new TraceService();
    (service as any).repository = mockRepository;
  });
  const mockTraceId = 'traceId';
  const mockTraceDocument: TraceData = {
    id: 'traceId',
    error: null,
    child_runs: [],
    end_time: new Date().getTime(),
    extra: new Map<string, unknown>(),
    inputs: new Map<string, unknown>(),
    latency: null,
    outputs: new Map<string, unknown>(),
    parent_run_id: null,
    run_type: 'llm',
    start_time: new Date().getTime(),
    run_id: mockTraceId,
    name: 'Test Trace',
    trace_id: null,
    dotted_order: null,
  };


  describe('getTraces', () => {
    it('should get all traces when both start and end date are populated', async () => {
      const expectedResult: TraceData[] = [mockTraceDocument];
      mockRepository.getTraces.mockResolvedValue(expectedResult);

      mockRepository.getFeedbackCounts.mockResolvedValue(
        [{
          key: 'useful',
          feedbackType: 'value',
          counts: { 'true': 0, 'false': 0 }
        }]
      );

      mockRepository.getLatencyPercentile.mockResolvedValue([
          { percentile: 0, latency: 0 } as TracePercentile,
      ]
      );

      const result = await service.getTopLevelTraces(mockProjectId);

      expect(result).toEqual({
        feedback_counts: [{
          key: 'useful',
          feedbackType: 'value',
          counts: { 'true': 0, 'false': 0 }
        }],
        latency_percentiles: [{ percentile: 0, latency: 0 }],
        traces: expectedResult
      } satisfies TracesResponse);
      expect(mockRepository.getTraces).toHaveBeenCalled();
    });
  });

  describe('getTraceTreeByRunId', () => {
    const mockTraceId = 'traceId';

    it('should return null if no trace is found', async () => {
      mockRepository.getTraceTreeById.mockResolvedValue([]);

      const result = await service.getTraceTreeByRunId(mockProjectId, mockTraceId);

      expect(result).toBeNull();
      expect(mockRepository.getTraceTreeById).toHaveBeenCalledWith(mockProjectId, mockTraceId);
    });

    it('should throw an error if multiple traces are found', async () => {
      mockRepository.getTraceTreeById.mockResolvedValue([mockTraceDocument, mockTraceDocument]);

      await expect(service.getTraceTreeByRunId(mockProjectId, mockTraceId))
        .rejects.toThrow('Trace not found');
      expect(mockRepository.getTraceTreeById).toHaveBeenCalledWith(mockProjectId, mockTraceId);
    });

    it('should return a trace document if exactly one trace is found', async () => {

      mockRepository.getTraceTreeById.mockResolvedValue([mockTraceDocument]);

      const result = await service.getTraceTreeByRunId(mockProjectId, mockTraceId);

      expect(result).toEqual(mockTraceDocument);
      expect(mockRepository.getTraceTreeById).toHaveBeenCalledWith(mockProjectId, mockTraceId);
    });
  });
});
