import React from 'react';
import styles from './FilterPanel.module.scss';
import { TracePercentile } from '@/models/traces_response';

interface FilterPanelProps {
  recordsCount: number;
  latencyPercentiles: TracePercentile[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({ latencyPercentiles, recordsCount }) => {

  return (
    <div className={styles.filterPanel}>
      <h2>Details</h2>
      <h3>Records</h3>
      <div>
        <p>{recordsCount}</p>
      </div>
      <h3>Latency</h3>
      {latencyPercentiles.map((percentile, index) => {
        return (
          <div key={index} className={styles.percentileChip}>
            <p>P{percentile.percentile * 100}: {(percentile.latency / 1000).toFixed(2)}s</p>
          </div>
        );
      })
      }
    </div>
  );
};


export default FilterPanel;
