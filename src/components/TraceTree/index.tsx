import React, { useState, useEffect } from 'react';
import { Add, Minus } from 'iconic-react';
import styles from './traceTree.module.scss';

const TraceTree = ({ traceData, expandedNodes, onNodeToggle, onSelectTrace }) => {
  const [selectedTraceId, setSelectedTraceId] = useState(traceData?.run_id || null);

  useEffect(() => {
    if (traceData) {
      onSelectTrace(traceData);
    }
  }, [traceData, onSelectTrace]);

  const toggleExpand = (event, run_id) => {
    event.stopPropagation();
    onNodeToggle(prev => new Set(prev.has(run_id) ? prev.delete(run_id) && prev : prev.add(run_id)));
  };

  const handleSelectTrace = (trace) => {
    onSelectTrace(trace);
    setSelectedTraceId(trace.run_id);
  };

  const renderTrace = (trace) => {
    const isExpanded = expandedNodes.has(trace.run_id);
    const isSelected = trace.run_id === selectedTraceId;

    const traceHeaderClass = isSelected ? `${styles.traceHeader} ${styles.active}` : styles.traceHeader;

    return (
      <div key={trace.run_id} className={styles.traceNode}>
        <div className={traceHeaderClass}>
          <p onClick={() => handleSelectTrace(trace)} className={styles.traceTitle}>
            [{trace.run_type.toUpperCase()}] {trace.name}
          </p>
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
