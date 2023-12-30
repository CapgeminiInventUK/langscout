import React, { useState, useEffect } from 'react';
import { Add, Minus } from 'iconic-react';
import styles from './traceTree.module.scss';
import {TraceDetailResponse} from "@/models/trace_detail_response";

interface TraceTreeProps {
  traceData: TraceDetailResponse;
  expandedNodes: Set<string>;
  onNodeToggle: (expandedNodes: (((prevState: Set<string>) => Set<string>) | Set<string>)) => void;
  onSelectTrace: (trace: TraceDetailResponse) => void;
}

const TraceTree: React.FC<TraceTreeProps> = ({ traceData, expandedNodes, onNodeToggle, onSelectTrace }) => {
  const [selectedTraceId, setSelectedTraceId] = useState(traceData?.run_id || null);

  useEffect(() => {
    if (traceData) {
      onSelectTrace(traceData);
    }
  }, [traceData, onSelectTrace]);

  const toggleExpand = (event: React.MouseEvent<HTMLSpanElement>, run_id: string) => {
    event.stopPropagation();
    onNodeToggle((prev: Set<string>) => {
      const newSet: Set<string> = new Set(prev);
      if (prev.has(run_id)) {
        newSet.delete(run_id);
      } else {
        newSet.add(run_id);
      }
      return newSet;
    });  };

  const handleSelectTrace = (trace: TraceDetailResponse) => {
    onSelectTrace(trace);
    setSelectedTraceId(trace.run_id);
  };

  const renderTrace = (trace: TraceDetailResponse) => {
    const isExpanded = expandedNodes.has(trace.run_id);
    const isSelected = trace.run_id === selectedTraceId;

    const traceHeaderClass = isSelected ? `${styles.traceHeader} ${styles.active}` : styles.traceHeader;

    return (
      <div key={trace.run_id}>
        <div className={traceHeaderClass}>
          <div onClick={() => handleSelectTrace(trace)} className={styles.traceTitle}>
            <span className={styles.runTypeBox}>{trace.run_type.toUpperCase()}</span>
            {trace.name}
          </div>
          {trace.children?.length > 0 && (
            <span onClick={(e) => toggleExpand(e, trace.run_id)} className={styles.toggleIcon}>
              {isExpanded ? <Minus/> : <Add/>}
            </span>
          )}
        </div>
        {trace.children && isExpanded && (
          <div className={styles.traceChildren}>
            {trace.children.map(child => renderTrace(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.traceTree}>
      {traceData && renderTrace(traceData)}
    </div>
  );
};

export default TraceTree;