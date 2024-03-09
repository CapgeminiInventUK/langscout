'use client';

import { TraceContext } from '@/components/trace/contexts/trace-context';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import TraceTree from '@/components/trace/trace-tree';
import TraceDetailsPanel from '@/components/trace/trace-details-panel';
import { TraceTreeNode } from '@/models/responses/trace-detail-response';
import { useState } from 'react';

interface TracePageProps {
  traceData: TraceTreeNode;
  traceId: string;
}

export default function TracePage({ traceData, traceId }: TracePageProps) {
  const [selectedTraceId, setSelectedTraceId] =
    useState<string | undefined>(traceData.run_id);

  const [selectedTrace, onSelectedTrace] =
    useState<TraceTreeNode | undefined>(traceData);

  const [expandedNodes, setExpandedNodes] =
    useState(new Set<string>([traceData.run_id, ...traceData.children
      .filter((child) => {
        return child.depth === 0;
      })
      .map((child) => child.run_id)
    ]));

  return <TraceContext.Provider value={
    {
      traceId: traceId,
      selectedTraceId: selectedTraceId,
      setSelectedTraceId: setSelectedTraceId,
      selectedTrace: selectedTrace,
      onSelectTrace: onSelectedTrace,
      traceData: traceData,
      setExpandedNodes: setExpandedNodes,
      expandedNodes: expandedNodes,
    }
  }><ResizablePanelGroup direction="horizontal" className="flex gap-4">
      <ResizablePanel defaultSize={33} minSize={20}>
        <TraceTree/>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel defaultSize={67}>
        <TraceDetailsPanel/>
      </ResizablePanel>
    </ResizablePanelGroup>
  </TraceContext.Provider>;

}
