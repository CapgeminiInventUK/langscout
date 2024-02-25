import React, { useState, useEffect } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md';
import {
  TraceTreeNode,
} from '@/models/trace-detail-response';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';

interface TraceTreeProps {
  traceData: TraceTreeNode;
  expandedNodes: Set<string>;
  onNodeToggle: (expandedNodes: (((prevState: Set<string>) => Set<string>) | Set<string>)) => void;
  onSelectTrace: (trace: TraceTreeNode) => void;
}

const TraceTree: React.FC<TraceTreeProps> = ({
  traceData,
  expandedNodes,
  onNodeToggle,
  onSelectTrace
}) => {
  const [selectedTraceId, setSelectedTraceId] = useState(traceData?.run_id || null);

  useEffect(() => {
    onSelectTrace(traceData);
  }, [traceData, onSelectTrace]);

  const toggleExpand = (event: React.MouseEvent<HTMLSpanElement>, run_id: string) => {
    event.stopPropagation();
    onNodeToggle((prev: Set<string>) => {
      const newSet: Set<string> = new Set(prev);
      if (prev.has(run_id)) {
        newSet.delete(run_id);
      } else {
        newSet.add(run_id);
      }
      return newSet;
    });
  };

  const handleSelectTrace = (trace: TraceTreeNode) => {
    onSelectTrace(trace);
    setSelectedTraceId(trace.run_id);
  };

  const renderTrace = (trace: TraceTreeNode) => {
    const isExpanded = expandedNodes.has(trace.run_id);
    const isSelected = trace.run_id === selectedTraceId;

    return (
      <div key={trace.run_id}>
        <ToggleGroup
          type="single"
          orientation="vertical"
          className="w-full flex-col items-start"
          value={selectedTraceId ?? ''}
          onValueChange={() => handleSelectTrace(trace)}
        >
          <ToggleGroupItem
            value={trace.run_id} className="w-full">
            <div onClick={() => handleSelectTrace(trace)}
              className="flex-1
              font-normal
              flex items-center whitespace-nowrap overflow-hidden truncate gap-2"
            >
              <Badge variant="outline">
                {trace.run_type.toUpperCase()}
              </Badge>
              {trace.name}
            </div>
            <div>
              <span className="pl-2 text-xs">{(trace.latency / 1000).toFixed(2)}s</span>
            </div>
            {trace.children?.length > 0 && (
              <span onClick={(e) =>
                toggleExpand(e, trace.run_id)} className={'inline-block ml-1.5'}>
                {isExpanded ? <MdRemove/> : <MdAdd/>}
              </span>
            )}
            {trace.children?.length === 0 && <span className={'w-5'}/>}
          </ToggleGroupItem>
          {trace.children && isExpanded && (
            <div className="w-full ml-2 pr-2 border-l-2 border-l-primary pl-1.5">
              {trace.children.map(child => renderTrace(child))}
            </div>
          )}
        </ToggleGroup>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Trace
        </CardTitle>
      </CardHeader>
      <CardContent>
        {traceData && renderTrace(traceData)}
      </CardContent>
    </Card>
  );
};

export default TraceTree;
