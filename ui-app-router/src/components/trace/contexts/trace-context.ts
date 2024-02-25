import { createContext } from 'react';
import { TraceTreeNode } from '@/models/responses/trace-detail-response';

interface TraceContextProps {
  traceId: string;
  selectedTraceId?: string;
  traceData?: TraceTreeNode;
  expandedNodes: Set<String>;
  setExpandedNodes: (expandedNodes: ((prevState: Set<string>) =>
    Set<string>) | Set<string>
  ) => void;
  setSelectedTraceId: (_: string) => void;
  onSelectTrace: (_: TraceTreeNode) => void;
  selectedTrace?: TraceTreeNode;
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
  onSelectTrace: (_: TraceTreeNode) => {
  },
});
