import Breadcrumb from '@/components/Breadcrumb';
import styles from './Traces.module.scss';
import React, { ReactElement } from 'react';
import { getTraces } from '@/services/traceService';
import {
  BsCheckCircleFill, BsClockFill,
  BsExclamationCircleFill,
  BsFillQuestionCircleFill
} from 'react-icons/bs';
import { IconType } from 'react-icons/lib';

const breadcrumbItems = [
  { name: 'Home', path: '/' },
  { name: 'Traces', path: undefined },
];

interface Trace {
  run_id: string;
  name: string;
  error?: string;
  start_time: string;
  end_time?: string;
  latency: number;
}

interface TracesProps {
  traces: Trace[];
}

interface DateTime {
  date: string;
  time: string;
}

function convertToDateTime(timestamp: string): DateTime {
  const dateObj = new Date(timestamp);

  const date = dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  const time = dateObj.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  return { date, time };
}


const handleRowClick = (run_id: string) => {
  window.location.href = `/traces/${run_id}`;
};

function getStatusForTrace(trace: Trace): ReactElement<IconType> {
  if (trace.error) {
    return <BsExclamationCircleFill color={'red'}/>;
  } else if (trace.end_time) {
    return <BsCheckCircleFill color={'green'}/>;
  } else if (trace.end_time === undefined || trace.end_time === null) {
    return <BsClockFill color={'grey'}/>;
  } else {
    return <BsFillQuestionCircleFill color={'orange'}/>
      ;
  }
}

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
            <th className={styles.fullWidthTable__tableColumnCentre}>Status</th>
            <th>Name</th>
            <th>Start Time</th>
            <th>Latency</th>
          </tr>
          </thead>
          <tbody>
          {traces.map(trace => {
            const runDate = convertToDateTime(trace.start_time);
            return (
              <tr key={trace.run_id} onClick={() => handleRowClick(trace.run_id)}
                  className={styles.clickableRow}>
                <td>{trace.run_id}</td>
                <td className={styles.fullWidthTable__columnIcon}>{getStatusForTrace(trace)}</td>
                <td>{trace.name}</td>
                <td>{runDate.date} @ {runDate.time}</td>
                <td>{trace.latency ? `${(trace.latency / 1000).toFixed(2)}s` : '-'}</td>
              </tr>
            );
          })}
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
