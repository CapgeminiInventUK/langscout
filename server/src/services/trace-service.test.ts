import { TraceService } from './trace-service';
import { TraceDetailResponse } from '../models/trace-detail-response';
import { ApiRepository } from '../repositories/api-repository';
import { TracesResponse } from '../models/traces-response';
import { TracePercentile } from '../models/traces-percentiles';

jest.mock('../repositories/api-repository');

describe('TraceService', () => {
  let service: TraceService;
  let mockRepository: jest.Mocked<ApiRepository>;

  beforeEach(() => {
    mockRepository = new ApiRepository() as any;
    service = new TraceService();
    (service as any).repository = mockRepository;
  });
  const mockTraceId = 'traceId';
  const mockTraceDocument: TraceDetailResponse = {
    children: [],
    end_time: '',
    input: new Map<string, unknown>(),
    latency: null,
    output: new Map<string, unknown>(),
    parent_run_id: null,
    run_type: '',
    session_name: '',
    start_time: '',
    'run_id': mockTraceId, name: 'Test Trace'
  };


  describe('getTraces', () => {
    it('should get all traces when both start and end date are populated', async () => {
      const expectedResult: TraceDetailResponse[] = [{
        run_id: mockTraceId,
        latency: 7418,
        start_time: '2023-12-29T20:06:43.539+00:00',
        end_time: '2023-12-29T20:06:50.957+00:00'
      } as TraceDetailResponse
      ];
      mockRepository.getTraces.mockResolvedValue(expectedResult);

      mockRepository.getFeedbackCounts.mockResolvedValue(
        [{ key: 'useful', counts: { 'true': 0, 'false': 0 } }]);

      mockRepository.getLatencyPercentile.mockResolvedValue( [
          { percentile: 0, latency: 0 } as TracePercentile,
      ]
      );

      const result = await service.getTopLevelTraces();

      expect(result).toEqual({
        feedback_counts: [{ key: 'useful', counts: { 'true': 0, 'false': 0 } }],
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

      const result = await service.getTraceTreeByRunId(mockTraceId);

      expect(result).toBeNull();
      expect(mockRepository.getTraceTreeById).toHaveBeenCalledWith(mockTraceId);
    });

    it('should throw an error if multiple traces are found', async () => {
      mockRepository.getTraceTreeById.mockResolvedValue([mockTraceDocument, mockTraceDocument]);

      await expect(service.getTraceTreeByRunId(mockTraceId)).rejects.toThrow('Trace not found');
      expect(mockRepository.getTraceTreeById).toHaveBeenCalledWith(mockTraceId);
    });

    it('should return a trace document if exactly one trace is found', async () => {

      mockRepository.getTraceTreeById.mockResolvedValue([mockTraceDocument]);

      const result = await service.getTraceTreeByRunId(mockTraceId);

      expect(result).toEqual(mockTraceDocument);
      expect(mockRepository.getTraceTreeById).toHaveBeenCalledWith(mockTraceId);
    });
  });


})
;
