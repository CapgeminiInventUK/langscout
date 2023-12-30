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
      const mockTraces: TraceDetailResponse[] = [{
        run_id: 'traceId',
        start_time: '2023-12-29T20:06:43.539+00:00',
        end_time: '2023-12-29T20:06:50.957+00:00'
      } as TraceDetailResponse];

      const expectedResult: TraceDetailResponse[] = [{
        run_id: 'traceId',
        latency: 7418,
        start_time: '2023-12-29T20:06:43.539+00:00',
        end_time: '2023-12-29T20:06:50.957+00:00'
      } as TraceDetailResponse];
      mockRepository.getTraces.mockResolvedValue(mockTraces);

      const result = await service.getTraces();

      expect(result).toEqual(expectedResult);
      expect(mockRepository.getTraces).toHaveBeenCalled();
    });

    it('should get all traces when both start is populated but end is missing', async () => {
      const mockTraces: TraceDetailResponse[] = [{
        run_id: 'traceId',
        start_time: '2023-12-29T20:06:43.539+00:00'
      } as TraceDetailResponse];

      const expectedResult: TraceDetailResponse[] = [{
        run_id: 'traceId',
        start_time: '2023-12-29T20:06:43.539+00:00',
      } as TraceDetailResponse];
      mockRepository.getTraces.mockResolvedValue(mockTraces);

      const result = await service.getTraces();

      expect(result).toEqual(expectedResult);
      expect(mockRepository.getTraces).toHaveBeenCalled();
    });
  });

  describe('getTrace', () => {
    it('should get a trace by ID', async () => {
      const mockTraceId = 'traceId';
      const mockChildId = 'childId';
      const mockTopLeveTrace: TraceDetailResponse = {
        run_id: mockTraceId,
        start_time: '2023-12-29T20:06:43.539+00:00',
        end_time: '2023-12-29T20:06:50.957+00:00',
        parent_run_id: null
      } as TraceDetailResponse;
      const mockChildOfTopLevel: TraceDetailResponse = {
        run_id: mockChildId,
        start_time: '2023-12-29T20:06:43.539+00:00',
        end_time: '2023-12-29T20:06:50.957+00:00',
        parent_run_id: mockTraceId
      } as TraceDetailResponse;
      mockRepository.getTraceByRunId.mockResolvedValue(mockTopLeveTrace);

      mockRepository.getChildrenForParentRunId
        .mockResolvedValueOnce([mockChildOfTopLevel])
        .mockResolvedValueOnce([] as TraceDetailResponse[]);

      const result = await service.getTrace(mockTraceId);
      //
      expect(result).toEqual({
        ...mockTopLeveTrace,
        children: [mockChildOfTopLevel]
      });
      expect(mockRepository.getChildrenForParentRunId).toHaveBeenCalledWith(mockTraceId);
      expect(mockRepository.getTraceByRunId).toHaveBeenCalledWith(mockTraceId);
    });

    it('should throw an error if the trace is not found', async () => {
      await expect(service.getTrace(mockTraceId)).rejects.toThrow('Trace not found');
      expect(mockRepository.getTraceByRunId).toHaveBeenCalledWith(mockTraceId);
    });
  });
});
