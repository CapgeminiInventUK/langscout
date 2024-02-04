import React from 'react';
import styles from './trace-details-panel.module.scss';
import { TraceTreeNode } from '@/models/trace-detail-response';

interface TraceDetailsPanelProps {
  selectedTrace: TraceTreeNode | null;
}

const TraceDetailsPanel: React.FC<TraceDetailsPanelProps> = ({ selectedTrace }) => {
  return (
    <div className={styles.traceDetailsPanel}>
      {selectedTrace && (
        <>
          <h2 className={styles.title}>{selectedTrace.name}</h2>
          <div>
            <strong>Inputs:</strong>
            <pre className={styles.content + ' ' + styles.contentInput}>
              {JSON.stringify(selectedTrace.inputs, null, 2)}
            </pre>
          </div>
          <div className={styles.divider}/>
          <div>
            <strong>Outputs:</strong>
            <pre className={styles.content}>
              {JSON.stringify(selectedTrace.outputs?.output ?? selectedTrace.outputs, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

export default TraceDetailsPanel;
