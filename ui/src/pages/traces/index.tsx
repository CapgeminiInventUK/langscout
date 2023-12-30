import Breadcrumb from "@/components/Breadcrumb";
import styles from './Traces.module.scss';
import React from "react";
import {getTraces} from "@/services/traceService";

const breadcrumbItems = [
  {name: 'Home', path: '/'},
  {name: 'Traces', path: undefined},
];

interface Trace {
  run_id: string;
  name: string;
  start_time: string;
  latency: number;
}

interface TracesProps {
  traces: Trace[];
}

const handleRowClick = (run_id: string) => {
  window.location.href = `/traces/${run_id}`;
};

const Traces: React.FC<TracesProps> = ({ traces }) => {
  return (
    <div>
      <Breadcrumb items={breadcrumbItems}/>
      <h1>Traces</h1>
      <div className={styles.tableContainer}>
        <table className={styles.fullWidthTable}>
          <thead>
          <tr>
            <th>Run ID</th>
            <th>Name</th>
            <th>Start Time</th>
            <th>Latency</th>
          </tr>
          </thead>
          <tbody>
          {traces.map(trace => (
            <tr key={trace.run_id} onClick={() => handleRowClick(trace.run_id)} className={styles.clickableRow}>
              <td>{trace.run_id}</td>
              <td>{trace.name}</td>
              <td>{trace.start_time}</td>
              <td>{`${(trace.latency / 1000).toFixed(2)}s`}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  const data = await getTraces();
  return { props: { traces: data.traces } };
}

export default Traces;
