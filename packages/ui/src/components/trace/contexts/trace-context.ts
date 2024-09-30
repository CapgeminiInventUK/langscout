import { createContext } from 'react';
import { TraceData } from '@langscout/models';

interface TraceContextProps {
  traceId: string;
  selectedTraceId?: string;
  traceData?: TraceData;
  expandedNodes: Set<String>;
  setExpandedNodes: (expandedNodes: ((prevState: Set<string>) =>
    Set<string>) | Set<string>
  ) => void;
  setSelectedTraceId: (_: string) => void;
  onSelectTrace: (_: TraceData) => void;
  selectedTrace?: TraceData;
}

export const TraceContext = createContext<TraceContextProps>({
  traceId: '',
  selectedTraceId: undefined,
  traceData: undefined,
  expandedNodes: new Set<String>(),
  setExpandedNodes: (_: (((prevState: Set<string>) => Set<string>) | Set<string>)) => {
  },
  setSelectedTraceId: (_: string) => {
  },
  selectedTrace: undefined,
  onSelectTrace: (_: TraceData) => {
  },
});
