import React, { useEffect, useState } from 'react';
import TraceTree from '../../../../components/TraceTree';
import TraceDetailsPanel from '../../../../components/TraceDetailsPanel';
import { getTraceTree } from '@/services/traceService';
import styles from './traceDetailsPage.module.scss';
import Breadcrumb from '@/components/Breadcrumb';
import { TraceTreeNode } from '@/models/trace_detail_response';
import { GetServerSidePropsContext } from 'next';
import { usePathname } from 'next/navigation';
import { getParentPageFromUrlPath } from '@/lib/utils/getParentPageFromUrlPath';

interface TraceDetailsPageProps {
  projectId: string;
  traceData: TraceTreeNode;
}

const TraceDetailsPage: React.FC<TraceDetailsPageProps> = ({ projectId, traceData }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set<string>());
  const [selectedTrace, setSelectedTrace] = useState<TraceTreeNode | null>(null);

  useEffect(() => {
    const runIdToExpand = traceData
      .children.filter((child) => {
        return child.depth === 0;
      })
      .map((child) => child.run_id);
    setExpandedNodes(new Set([traceData.run_id, ...runIdToExpand]));
    setSelectedTrace(traceData);
  }, [traceData]);

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: `${projectId}`, path: `/projects/${projectId}` },
    { name: 'Traces', path: getParentPageFromUrlPath(usePathname()) },
    { name: `${traceData.run_id} @ ${traceData.start_time}`, path: undefined }
  ];

  return (
    <div>
      <Breadcrumb items={breadcrumbItems}/>
      <div className={styles.traceDetailsContainer}>
        <TraceTree
          traceData={traceData}
          expandedNodes={expandedNodes}
          onNodeToggle={setExpandedNodes}
          onSelectTrace={setSelectedTrace}
        />
        <TraceDetailsPanel selectedTrace={selectedTrace}/>
      </div>
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const traceId = context.params?.traceId as string;
    const projectId = context.params?.projectId as string;
    const traceData = await getTraceTree(projectId, traceId);
    return { props: { projectId, traceData } };
  } catch (error) {
    return { props: { error: 'Failed to fetch trace data' } };
  }
}

export default TraceDetailsPage;
