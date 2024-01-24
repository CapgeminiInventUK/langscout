import React from 'react';
import styles from './FilterPanel.module.scss';
import { TracePercentile } from '@/models/traces_response';
import PercentileChip from '../PercentileChip';

interface StatsPanelProps {
  recordsCount: number;
  latencyPercentiles: TracePercentile[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ latencyPercentiles, recordsCount }) => {

  return (
    <div className={styles.filterPanel}>
      <h2>Details</h2>
      <h3>Records</h3>
      <div>
        <p>{recordsCount}</p>
      </div>
      <h3>Percentiles</h3>
      <h4>Latency</h4>
      {latencyPercentiles.filter(({ latency }) => latency).length ? <div>
        {latencyPercentiles.map(({ percentile, latency }, index) => {
          return latency && (
            <div key={index + '-chip-block'} className={styles.filterPanelChips}>
              <PercentileChip key={index + '-chip'} percentile={percentile} value={latency}/>
            </div>
          );
        })
        }
      </div> : <div>
        <p>No latency data available</p>
      </div>
      }
      <h3>Feedback</h3>
    </div>
  );
};

export default StatsPanel;
