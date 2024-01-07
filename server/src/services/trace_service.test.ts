import { TraceService } from './trace_service';
import { LangtraceRepository } from '../repositories/langtrace_repository';
import { TraceDetailResponse } from '../models/trace_detail_response';

jest.mock('../repositories/langtrace_repository');

describe('TraceService', () => {
  let service: TraceService;
  let mockRepository: jest.Mocked<LangtraceRepository>;

  beforeEach(() => {
    mockRepository = new LangtraceRepository() as any;
    service = new TraceService();
    (service as any).repository = mockRepository;
  });
  const mockTraceId = 'traceId';

  describe('getTraces', () => {
    it('should get all traces when both start and end date are populated', async () => {
      const expectedResult: TraceDetailResponse[] = [{
        run_id: mockTraceId,
        latency: 7418,
        start_time: '2023-12-29T20:06:43.539+00:00',
        end_time: '2023-12-29T20:06:50.957+00:00'
      } as TraceDetailResponse];
      mockRepository.getTraces.mockResolvedValue(expectedResult);

      const result = await service.getTopLevelTraces();

      expect(result).toEqual(expectedResult);
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
      mockRepository.getTraceTreeById.mockResolvedValue([{}, {}]);

      await expect(service.getTraceTreeByRunId(mockTraceId)).rejects.toThrow('Trace not found');
      expect(mockRepository.getTraceTreeById).toHaveBeenCalledWith(mockTraceId);
    });

    it('should return a trace document if exactly one trace is found', async () => {
      const mockTraceDocument = { id: mockTraceId, name: 'Test Trace' };
      mockRepository.getTraceTreeById.mockResolvedValue([mockTraceDocument]);

      const result = await service.getTraceTreeByRunId(mockTraceId);

      expect(result).toEqual(mockTraceDocument);
      expect(mockRepository.getTraceTreeById).toHaveBeenCalledWith(mockTraceId);
    });
  });


});
