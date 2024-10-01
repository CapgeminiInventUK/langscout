'use client';

import { useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import TracesTable from '@/components/traces/traces-table';
import { FeedbackCount, TracePercentile } from '@/models/responses/traces-response';
import TracesSideBar from '@/components/traces/traces-side-bar';
import {
  FeedbackFilters,
  TracesFilterContext
} from '@/components/traces/contexts/traces-filter-context';
import { TraceData } from '@langscout/models';

interface TracesPageProps {
  projectId: string;
  startDate?: Date;
  endDate?: Date;
  feedbackFilters?: FeedbackFilters;
  traces: TraceData[];
  latency_percentiles: TracePercentile[];
  feedback_counts: FeedbackCount[];
}

export default function TracesPage({
  projectId,
  startDate: inputStartDate,
  endDate: inputEndDate,
  traces,
  latency_percentiles,
  feedback_counts,
  feedbackFilters: inputFeedbackFilters
}: TracesPageProps) {

  const [changePending, setChangePending] =
    useState<boolean>(false);

  const [startDate, setStartDate] =
    useState<Date | undefined>(inputStartDate);
  const [endDate, setEndDate] =
    useState<Date | undefined>(inputEndDate);
  const [feedbackFilters, setFeedbackFilters] =
    useState<FeedbackFilters>(inputFeedbackFilters ?? {});

  return <TracesFilterContext.Provider value={{
    startDate: startDate,
    setStartDate: setStartDate,
    endDate: endDate,
    setEndDate: setEndDate,
    feedbackFilters: feedbackFilters,
    setFeedbackFilters: setFeedbackFilters,
    changePending: changePending,
    setChangePending: setChangePending,
    // inLast: inLast
  }}>
    <div>
      <ResizablePanelGroup direction="horizontal" className="flex gap-4">
        <ResizablePanel defaultSize={80}>
          <TracesTable
            traces={traces}
            projectId={projectId}
          />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={20} minSize={15}>
          <TracesSideBar
            traceCount={traces.length}
            latency_percentiles={latency_percentiles}
            feedback_counts={feedback_counts}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  </TracesFilterContext.Provider>;
}
