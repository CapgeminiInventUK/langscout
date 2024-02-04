import React from 'react';
import styles from '@/components/PercentileChip/percentile-chip.module.scss';

interface PercentileChipProps {
  value: number;
  percentile: number;
}

const PercentileChip: React.FC<PercentileChipProps> = ({ value, percentile } ) => {
  function valueToCssColour(value: number) {
    if (value < 5000) {
      return styles.temperature1;
    } else if (value < 10000) {
      return styles.temperature2;
    } else if (value < 15000) {
      return styles.temperature3;
    } else {
      return styles.temperature4;
    }
  }

  return <div className={valueToCssColour(value)}>
    <p>P{percentile * 100}: {(value / 1000).toFixed(2)}s</p>
  </div>;
};

export default PercentileChip;
