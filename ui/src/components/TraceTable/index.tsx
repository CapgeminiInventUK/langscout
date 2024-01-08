import React from 'react';
import styles from '@/components/TraceTable/TraceTable.module.scss';

function TraceTable(props: {
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
  elements: React.JSX.Element[]
}) {
  return <div className={styles.tableContainer}>
    <div className={styles.headerRow}>
      <h1>Traces</h1>
      <div className={styles.filterContainer}>
        <select
          onChange={props.onChange}
          className={styles.dateDropdown}>
          <option value="">Select Range</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
        </select>
      </div>
    </div>
    <table className={styles.fullWidthTable}>
      <thead>
      <tr>
        <th>Run ID</th>
        <th className={styles.fullWidthTable__tableColumnCentre}>Status</th>
        <th>Name</th>
        <th>Start Time</th>
        <th>Latency</th>
      </tr>
      </thead>
      <tbody>
      {props.elements}
      </tbody>
    </table>
  </div>;
}

export default TraceTable;
