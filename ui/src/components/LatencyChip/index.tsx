import React from 'react';
import styles from '@/components/LatencyChip/LatencyChip.module.scss';

interface LatencyChipProps {
  latency: number;
}

const LatencyChip: React.FC<LatencyChipProps> = ({ latency } ) => {
  function valueToCssColour(value: number) {
    if (value < 3000) {
      return styles.temperature1;
    } else if (value < 5000) {
      return styles.temperature2;
    } else if (value < 10000) {
      return styles.temperature3;
    } else {
      return styles.temperature4;
    }
  }

  return <div className={valueToCssColour(latency)}>
    <p>{(latency / 1000).toFixed(2)}s</p>
  </div>;
};

export default LatencyChip;
