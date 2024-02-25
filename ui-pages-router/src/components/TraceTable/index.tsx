import React, { ReactElement, useEffect, useState } from 'react';
import { TraceTreeNode } from '@/models/trace-detail-response';
import { IconType } from 'react-icons/lib';
import { convertTimestampToDatetime } from '@/lib/utils/convert-timestamp-to-datetime';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  CheckIcon, ClockIcon, ExclamationTriangleIcon,
  InfoCircledIcon
} from '@radix-ui/react-icons';

function getStatusForTrace(trace: TraceTreeNode): ReactElement<IconType> {
  if (trace.error) {
    return <HoverCard openDelay={300}>
      <HoverCardContent className="text-start w-full max-h-36 overflow-auto">
        <div className="whitespace-pre">
          {trace.error}
        </div>
      </HoverCardContent>
      <HoverCardTrigger>
        <Badge className="px-3 py-1">
          <ExclamationTriangleIcon className="antialiased"/>
        </Badge>
      </HoverCardTrigger>
    </HoverCard>;
  } else if (trace.end_time) {
    return <Badge variant="outline" className="px-3 py-1">
      <CheckIcon className="antialiased"/>
    </Badge>;
  } else if (trace.end_time === undefined || trace.end_time === null) {
    return <Badge variant="secondary" className="px-3 py-1">
      <ClockIcon className="antialiased"/></Badge>;
  } else {
    return <Badge variant="outline" className="px-3 py-1">
      <InfoCircledIcon className="antialiased"/>
    </Badge>;
  }
}

const handleRowClick = (project_id: string, run_id: string) => {
  window.location.href = `/projects/${project_id}/traces/${run_id}`;
};

interface TraceTableParams {
  projectId: string;
  onChange: (value: string) => void;
  traces: TraceTreeNode[];
  //TODO Add in filter for feedback
}

const TraceTable: React.FC<TraceTableParams> = ({ projectId, onChange, traces }) => {
  const [feedbackKeyFilter, _] = useState<string | null>(null);
  const [filteredTraces, setFilteredTraces] = useState<TraceTreeNode[]>(traces);


  useEffect(() => {
    if (feedbackKeyFilter) {
      setFilteredTraces(traces.filter(trace => trace.feedback?.key === feedbackKeyFilter));
    } else {
      setFilteredTraces(traces);
    }
  }, [feedbackKeyFilter, traces]);


  return <div>
    <div className="flex items-center pb-2 justify-end">
      <div className="flex items-center">
        <Select onValueChange={(value) => onChange(value)}>
          <SelectTrigger><SelectValue placeholder="Select range"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last 1 hour</SelectItem>
            <SelectItem value="3h">Last 3 hours</SelectItem>
            <SelectItem value="12h">Last 12 hours</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
    <Card>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Latency</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTraces.map(trace => {
              const runDate = convertTimestampToDatetime(trace.start_time);
              const endDate = trace.end_time ? convertTimestampToDatetime(trace.end_time) : null;
              return <TableRow
                key={trace.run_id}
                onClick={() => handleRowClick(projectId, trace.run_id)}>
                <TableCell>{trace.name}</TableCell>
                <TableCell className="w-6 text-center">
                  {getStatusForTrace(trace)}
                </TableCell>
                <TableCell>{runDate.date} @ {runDate.time}</TableCell>
                <TableCell>
                  {trace.latency && <HoverCard openDelay={300}>
                    <HoverCardContent>
                      <div>
                        <p>Start: {runDate.date} @ {runDate.time}</p>
                        {endDate && <p>End: {endDate.date} @ {endDate.time}</p>}
                      </div>
                    </HoverCardContent>
                    <HoverCardTrigger>
                      <Badge variant="secondary" className="px-2 py-1">
                        {trace.latency?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}ms
                      </Badge>
                    </HoverCardTrigger>
                  </HoverCard>}
                </TableCell>
                <TableCell>
                  <HoverCard openDelay={300}>
                    <HoverCardContent>
                      <div>
                        <p>Input: {trace.totalInputTokenCount}</p>
                        <p>Output: {trace.totalOutputTokenCount}</p>
                        <p>Total: {trace.totalTokens}</p>
                      </div>
                    </HoverCardContent>
                    <HoverCardTrigger>
                      {trace.totalTokens}
                    </HoverCardTrigger>
                  </HoverCard>
                </TableCell>
                <TableCell>
                  <HoverCard openDelay={300}>
                    <HoverCardContent>
                      <div>
                        <p>Input: ${trace.totalInputCost?.toPrecision(2)}</p>
                        <p>Output: ${trace.totalOutputCost?.toPrecision(2)}</p>
                        <p>Total: ${trace.totalCost?.toPrecision(2)}</p>
                      </div>
                    </HoverCardContent>
                    <HoverCardTrigger>
                      ${trace.totalCost?.toPrecision(2)}
                    </HoverCardTrigger>
                  </HoverCard>
                </TableCell>
                <TableCell>{trace.feedback?.key
                  ? <HoverCard openDelay={300}>
                    <HoverCardContent>
                      <div>
                        <p>{trace.feedback.comment ?? 'No comment left'}</p>
                      </div>
                    </HoverCardContent>
                    <HoverCardTrigger>
                      {`${trace.feedback.key}: ${
                        trace.feedback.score !== undefined ?
                          trace.feedback.score :
                          trace.feedback.value
                      }`}
                    </HoverCardTrigger>
                  </HoverCard>
                  : ''}</TableCell>
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>;
};

export default TraceTable;
