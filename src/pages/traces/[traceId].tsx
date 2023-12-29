import React, {useState, useEffect} from 'react';
import TraceTree from '../../components/TraceTree';
import TraceDetailsPanel from '../../components/TraceDetailsPanel';
import {getTraceData} from '@/services/traceService';
import styles from './traceDetailsPage.module.scss';
import Breadcrumb from "@/components/Breadcrumb";
import {TraceDetailResponse} from "@/models/trace_detail_response";
import {GetServerSidePropsContext} from "next";

interface TraceDetailsPageProps {
  traceData: TraceDetailResponse;
}

const TraceDetailsPage: React.FC<TraceDetailsPageProps> = ({traceData}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set<string>());
  const [selectedTrace, setSelectedTrace] = useState<TraceDetailResponse | null>(null);

  useEffect(() => {
    if (traceData) {
      setExpandedNodes(new Set([traceData.run_id, ...traceData.children.map(child => child.run_id)]));
      setSelectedTrace(traceData);
    }
  }, [traceData]);

  const breadcrumbItems = [
    {name: 'Home', path: '/'},
    {name: 'Traces', path: '/traces'},
    {name: `Trace Details for ${traceData.run_id} @ ${traceData.start_time}`, path: undefined}
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
    const traceData = await getTraceData(traceId);
    return {props: {traceData}};
  } catch (error) {
    return {props: {error: 'Failed to fetch trace data'}};
  }
}

export default TraceDetailsPage;
