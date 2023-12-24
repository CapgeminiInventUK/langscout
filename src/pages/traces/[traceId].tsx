import {useState, useEffect} from 'react';
import TraceTree from '../../components/TraceTree';
import TraceDetailsPanel from '../../components/TraceDetailsPanel';
import {getTraceData} from '@/services/traceService';
import styles from './traceDetailsPage.module.scss';
import {useRouter} from 'next/router';
import Breadcrumb from "@/components/Breadcrumb";

const TraceDetailsPage = ({traceData}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedTrace, setSelectedTrace] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (traceData) {
      setExpandedNodes(new Set([traceData.run_id, ...traceData.children.map(child => child.run_id)]));
      setSelectedTrace(traceData);
    }
  }, [traceData]);

  const breadcrumbItems = [
    {name: 'Home', path: '/'},
    {name: 'Traces', path: '/traces'},
    {name: `Trace Details`, path: undefined} // Current page
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

export async function getServerSideProps(context) {
  try {
    const traceData = await getTraceData(context.params.traceId);
    return {props: {traceData}};
  } catch (error) {
    // Handle error appropriately
    return {props: {error: 'Failed to fetch trace data'}};
  }
}

export default TraceDetailsPage;
