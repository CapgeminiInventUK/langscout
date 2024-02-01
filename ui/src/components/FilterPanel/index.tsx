import React from 'react';
import styles from './FilterPanel.module.scss';
import { FeedbackCount, TracePercentile } from '@/models/traces_response';
import PercentileChip from '../PercentileChip';
import { FeedbackFilters } from '@/pages/traces';

interface StatsPanelProps {
  recordsCount: number;
  latencyPercentiles: TracePercentile[];
  feedbackCounts: FeedbackCount[];
  feedbackFilters: FeedbackFilters;
  onFeedbackSelect: (key: string, value: string, isSelected: boolean) => void;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  latencyPercentiles,
  recordsCount,
  feedbackCounts,
  feedbackFilters,
  onFeedbackSelect,
}) => {

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
      {feedbackCounts.length > 0 && feedbackCounts.map(({ key, counts }, index) => {
        return (
          <div key={index + '-feedback-key'}>
            <p><strong>{key}</strong></p>
            {counts && Object.entries(counts).map(([feedbackKey, feedbackValue], feedbackIndex) => (
              <p key={feedbackIndex}>
                <input
                  type="checkbox"
                  value={feedbackKey}
                  checked={feedbackFilters[key]?.includes(feedbackKey)}
                  onChange={(e) => onFeedbackSelect(key, feedbackKey, e.target.checked)}
                />{`${feedbackKey}: ${feedbackValue}`}
              </p>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default StatsPanel;
