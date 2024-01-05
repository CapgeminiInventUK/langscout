import React from 'react';
import styles from './traceDetailsPanel.module.scss';
import { TraceDetailResponse } from '@/models/trace_detail_response';

interface TraceDetailsPanelProps {
  selectedTrace: TraceDetailResponse | null;
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
