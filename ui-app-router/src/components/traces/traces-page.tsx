"use client";

import { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import TracesTable from '@/components/traces/traces-table';
import { FeedbackCount, TracePercentile } from '@/models/responses/traces-response';
import { TraceTreeNode } from '@/models/responses/trace-detail-response';
import TracesSideBar from '@/components/traces/traces-side-bar';
import { TracesFilterContext } from '@/components/traces/contexts/traces-filter-context';

interface TracesPageProps {
  projectId: string;
  startDate?: Date;
  endDate?: Date;
  traces: TraceTreeNode[];
  latency_percentiles: TracePercentile[];
  feedback_counts: FeedbackCount[];
}

export default function TracesPage({ projectId, startDate: inputStartDate, endDate: inputEndDate, traces, latency_percentiles, feedback_counts }: TracesPageProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(inputStartDate);
  const [endDate, setEndDate] = useState<Date | undefined>(inputEndDate);

  return <TracesFilterContext.Provider value={{
    startDate: startDate,
    setStartDate: setStartDate,
    endDate: endDate,
    setEndDate: setEndDate,
    // feedbackFilters: feedbackFilters,
    // inLast: inLast
  }}>
    <div>
      <ResizablePanelGroup direction="horizontal" className="flex gap-4 py-4 px-4">
        <ResizablePanel defaultSize={80}>
          <TracesTable traces={traces} projectId={projectId}/>
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel defaultSize={20} minSize={10}>
          <TracesSideBar
            latency_percentiles={latency_percentiles}
            feedback_counts={feedback_counts}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </TracesFilterContext.Provider>;
}
