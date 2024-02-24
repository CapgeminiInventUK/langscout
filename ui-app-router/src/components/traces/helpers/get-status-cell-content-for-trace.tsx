import { TraceTreeNode } from '@/models/responses/trace-detail-response';
import { ReactElement } from 'react';
import {
  CheckIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon
} from '@radix-ui/react-icons';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Badge } from '@/components/ui/badge';

export default function getStatusCellContentForTrace(trace: TraceTreeNode): ReactElement {
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
