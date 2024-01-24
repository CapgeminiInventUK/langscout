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
          <option value="1h">Last 1 hour</option>
          <option value="3h">Last 3 hours</option>
          <option value="12h">Last 12 hours</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
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
        <th>Feedback</th>
      </tr>
      </thead>
      <tbody>
      {props.elements}
      </tbody>
    </table>
  </div>;
}

export default TraceTable;
