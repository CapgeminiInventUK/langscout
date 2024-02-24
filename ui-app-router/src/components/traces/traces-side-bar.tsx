'use client';

import { useContext } from 'react';
import { TracesFilterContext } from '@/components/traces/contexts/traces-filter-context';
import { Button } from '@/components/ui/button';
import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { FeedbackCount, TracePercentile } from '@/models/responses/traces-response';
import { applyFilters } from '@/components/traces/helpers/apply-filters';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import TracesSideBarFeedback from '@/components/traces/traces-side-bar-feedback';
import TracesSideBarLatencyPercentiles
  from '@/components/traces/traces-side-bar-latency-percentiles';

interface TracesSideBarProps {
  traceCount: number;
  latency_percentiles: TracePercentile[];
  feedback_counts: FeedbackCount[];
}

export default function TracesSideBar({
  traceCount,
  latency_percentiles,
  feedback_counts
}: TracesSideBarProps) {
  let {
    startDate,
    endDate,
    feedbackFilters
  } = useContext(TracesFilterContext);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();


  return <>
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base font-bold">
          Records
        </p>
        <p className="text-sm font-medium">
          {traceCount}
        </p>
        <Separator className="my-4"/>
        <p className="text-base text-muted-foreground">
          Percentiles
        </p>
        <p className="text-base font-bold">
          Latency
        </p>
        <TracesSideBarLatencyPercentiles latency_percentiles={latency_percentiles}/>
        {feedback_counts.length > 0 && <TracesSideBarFeedback feedback_counts={feedback_counts}/>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => applyFilters(
            replace,
            pathname,
            searchParams,
            feedbackFilters,
            startDate,
            endDate
          )}>
          Apply filters
        </Button>
      </CardFooter>
    </Card>
  </>;
}
