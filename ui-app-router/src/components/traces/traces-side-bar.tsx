"use client";

import { useContext } from 'react';
import { TracesFilterContext } from '@/components/traces/contexts/traces-filter-context';
import { Button } from '@/components/ui/button';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FeedbackCount, TracePercentile } from '@/models/responses/traces-response';
import { applyFilters } from '@/components/traces/helpers/apply-filters';

interface TracesSideBarProps {
  latency_percentiles: TracePercentile[];
  feedback_counts: FeedbackCount[];
}

export default function TracesSideBar({ latency_percentiles, feedback_counts }: TracesSideBarProps) {
  let { startDate, endDate, setStartDate, setEndDate } = useContext(TracesFilterContext);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  return <>
    <div>
      <Button onClick={() => applyFilters(
        replace,
        pathname,
        searchParams,
        startDate, endDate)}>
        Apply
      </Button>
    </div>
    <div>
      <input type="date" value={startDate?.toISOString()}
             onChange={(e) => setStartDate(new Date(e.target.value))}/>
    </div>
    <div>
      <input type="date" value={endDate?.toISOString()}
             onChange={(e) => setEndDate(new Date(e.target.value))}/>
    </div>
  </>;
}
