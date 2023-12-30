import { LangchainToLangtraceService } from './langchain_to_langtrace_service';
import { LangtraceRepository } from '../repositories/langtrace_repository';
import { TraceData } from '../models/requests/trace_request';

jest.mock('../repositories/langtrace_repository');

describe('LangchainToLangtraceService', () => {
  let service: LangchainToLangtraceService;
  let mockRepository: jest.Mocked<LangtraceRepository>;

  beforeEach(() => {
    mockRepository = new LangtraceRepository() as any;
    service = new LangchainToLangtraceService();
    (service as any).langtraceRepository = mockRepository;
  });

  describe('createTrace', () => {
    it('should create a trace', async () => {
      const traceId = 'traceId';
      const mockTraceData: TraceData = {
        id: traceId,
        start_time: '2023-12-29T20:06:43.539+00:00',
        end_time: '2023-12-29T20:06:50.957+00:00'
      };
      mockRepository.insertTrace.mockResolvedValue();

      const result = await service.createTrace(mockTraceData);

      expect(result).toEqual(traceId);
      expect(mockRepository.insertTrace).toHaveBeenCalledWith(mockTraceData);
    });
  });

  describe('updateTrace', () => {
    it('should update a trace', async () => {
      const mockTraceId = 'traceId';
      const mockTraceData: TraceData = {
        start_time: '2023-12-29T20:06:43.539+00:00',
        end_time: '2023-12-29T20:06:50.957+00:00'
      };
      mockRepository.updateTrace.mockResolvedValue({
        acknowledged: true,
        modifiedCount: 1,
        upsertedCount: 0,
        upsertedId: null,
        matchedCount: 1
      });

      const result = await service.updateTrace(mockTraceId, mockTraceData);

      expect(result).toEqual(true);
      expect(mockRepository.updateTrace).toHaveBeenCalledWith(mockTraceId, mockTraceData);
    });
  });
});
