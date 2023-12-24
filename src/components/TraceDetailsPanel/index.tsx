import React from 'react';
import styles from './traceDetailsPanel.module.scss';

const TraceDetailsPanel = ({ selectedTrace }) => {
  return (
    <div className={styles.traceDetailsPanel}>
      {selectedTrace && (
        <>
          <h2 className={styles.title}>Details for Trace: {selectedTrace.run_id}</h2>
          <div>
            <strong>Inputs:</strong>
            <pre className={styles.content}>
              {JSON.stringify(selectedTrace.inputs, null, 2)}
            </pre>
          </div>
          <div>
            <strong>Outputs:</strong>
            <pre className={styles.content}>
              {JSON.stringify(selectedTrace.outputs.output ?? selectedTrace.outputs, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};

export default TraceDetailsPanel;
