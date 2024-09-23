import { getTraceTree } from '@/services/trace-service';
import TracePage from '@/components/trace/trace-page';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Langscout | Trace',
};

export default async function Trace({ params }:
  {
    params: {
      projectId: string
      traceId: string
    }
  }) {

  const traceId = params.traceId as string;
  const projectId = params.projectId as string;
  const traceData = await getTraceTree(projectId, traceId);

  return <TracePage
    traceData={traceData}
    traceId={traceId}
  />;
}
