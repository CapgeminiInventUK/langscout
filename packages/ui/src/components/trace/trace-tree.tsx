'use client';

import { Card, CardContent } from '@/components/ui/card';
import React, { useContext } from 'react';
import { TraceContext } from '@/components/trace/contexts/trace-context';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { Badge } from '@/components/ui/badge';
import { TraceTreeNode } from '@/models/responses/trace-detail-response';

export default function TraceTree() {

  const {
    traceData,
    expandedNodes,
    setExpandedNodes,
    selectedTraceId,
    setSelectedTraceId,
    onSelectTrace
  } = useContext(TraceContext);

  const handleSelectTrace = (trace: TraceTreeNode) => {
    onSelectTrace(trace);
    setSelectedTraceId(trace.run_id);
  };

  const toggleExpand = (event: React.MouseEvent<HTMLSpanElement>, run_id: string) => {
    event.stopPropagation();
    setExpandedNodes((prev: Set<string>) => {
      const newSet: Set<string> = new Set(prev);
      if (prev.has(run_id)) {
        newSet.delete(run_id);
      } else {
        newSet.add(run_id);
      }
      return newSet;
    });
  };

  const renderTrace = (trace: TraceTreeNode) => {
    const isExpanded = expandedNodes.has(trace.run_id);

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
            value={trace.run_id} className="w-full pl-1.5">
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
                {isExpanded ? <MinusIcon/> : <PlusIcon/>}
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
      <CardContent className={'py-4 px-4'}>
        {traceData && renderTrace(traceData)}
      </CardContent>
    </Card>
  );
}
