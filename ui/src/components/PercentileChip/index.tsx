import React from 'react';

interface PercentileChipProps {
  value: number;
  percentile: number;
}

const PercentileChip: React.FC<PercentileChipProps> = ({ value, percentile } ) => {
  return <div>
    <p className='font-bold font-sm'>P{percentile * 100}</p>
    <p className='font-sm'>{(value / 1000).toFixed(2)}s</p>
  </div>;
};

export default PercentileChip;
