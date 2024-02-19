import styles from '@/components/Tooltip/tooltip.module.scss';

import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [isHovered, setIsHovered] = useState(false);


  return <div
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    className={styles.tooltip}
  >
    {children}
    {isHovered && (
      <div className={styles.tooltiptext}>
        <pre>{text}</pre>
      </div>
    )}
  </div>;
};

export default Tooltip;
