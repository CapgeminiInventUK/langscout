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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { handlePredefinedRange } from '@/components/traces/helpers/handle-predefined-range';

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
    feedbackFilters,
    setStartDate,
    setEndDate,
    changePending,
    setChangePending
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

        {/*Set value=inLast*/}
        <Select defaultValue={'7d'} onValueChange={(value) => handlePredefinedRange(
          value,
          setStartDate,
          setEndDate,
          setChangePending
        )}>
          <SelectTrigger><SelectValue placeholder="Preset ranges"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last 1 hour</SelectItem>
            <SelectItem value="3h">Last 3 hours</SelectItem>
            <SelectItem value="12h">Last 12 hours</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="14d">Last 14 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
        <Separator className="my-4"/>
        <p className="text-base font-bold">
          Number of Traces
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
          disabled={!changePending}
          onClick={() => applyFilters(
            replace,
            pathname,
            searchParams,
            feedbackFilters,
            setChangePending,
            startDate,
            endDate,
          )}>
          Apply filters
        </Button>
      </CardFooter>
    </Card>
  </>;
}
