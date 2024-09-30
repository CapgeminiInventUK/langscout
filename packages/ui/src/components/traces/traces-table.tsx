'use strict';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { convertTimestampToDatetime } from '@/lib/utils/convert-timestamp-to-datetime';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';
import getStatusCellContentForTrace
  from '@/components/traces/helpers/get-status-cell-content-for-trace';
import { TraceData } from '@langscout/models';

interface TraceTableProps {
  projectId: string;
  traces: TraceData[];
}

export default function TracesTable({ projectId, traces }: TraceTableProps) {
  const handleRowClick = (project_id: string, run_id: string) => {
    window.location.href = `/projects/${project_id}/traces/${run_id}`;
  };

  return <div>
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
            {traces.map(trace => {
              const runDate = convertTimestampToDatetime(trace.start_time);
              const endDate = trace.end_time ? convertTimestampToDatetime(trace.end_time) : null;
              return <TableRow
                key={trace.run_id}
                onClick={() => handleRowClick(projectId, trace.run_id)}>
                <TableCell>{trace.name}</TableCell>
                <TableCell className="w-6 text-center">
                  {getStatusCellContentForTrace(trace)}
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
                <TableCell>{trace.feedback_stats
                  ? <HoverCard openDelay={300}>
                    <HoverCardContent>
                      <div>
                        <p>{trace.feedback_stats['comment'] ?? 'No comment left'}</p>
                      </div>
                    </HoverCardContent>
                    <HoverCardTrigger>
                      {
                        `${trace.feedback_stats['key']}: ${
                          'key' in trace.feedback_stats && 'score' in trace.feedback_stats ? trace.feedback_stats['score'] 
                            : trace.feedback_stats['value']}`
                      }
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
}
