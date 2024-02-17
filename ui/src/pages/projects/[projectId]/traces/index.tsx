import styles from './traces.module.scss';
import React, { useEffect, useState } from 'react';
import { getTraces } from '@/services/trace-service';
import { useRouter } from 'next/router';
import { GetServerSidePropsContext } from 'next';
import StatsPanel from '@/components/FilterPanel';
import TraceTable from '../../../../components/TraceTable';
import { FeedbackCount, TracePercentile } from '@/models/traces-response';
import { TraceTreeNode } from '@/models/trace-detail-response';
import AppBar from '@/components/AppBar';

interface DateRangeInt {
  startDate: Date;
  endDate: Date | null;

}

const handlePredefinedRange = (range: string): DateRangeInt => {
  const now = new Date();
  if (range === '1h') {
    return {
      startDate: new Date(now.getTime() - 60 * 60 * 1000),
      endDate: null,
    };

  } else if (range === '3h') {
    return {
      startDate: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      endDate: null,
    };
  } else if (range === '12h') {
    return {
      startDate: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      endDate: null,
    };
  } else if (range === '24h') {
    return {
      startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      endDate: null,
    };
  } else if (range === '7d') {
    return {
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: null,
    };
  } else if (range === '30d') {
    return {
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: null,
    };
  }
  throw new Error('Invalid range');
};


interface TracesProps {
  projectId: string;
  traces: TraceTreeNode[];
  latencyPercentiles: TracePercentile[];
  feedbackCounts: FeedbackCount[];
}

export interface FeedbackFilters {
  [key: string]: string[];
}


const Traces: React.FC<TracesProps> = ({
  projectId,
  traces,
  latencyPercentiles,
  feedbackCounts
}) => {
  const router = useRouter();

  const breadcrumbItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: `${projectId}`, path: `/projects/${projectId}` },
    { name: 'Traces', path: undefined },
  ];

  const parseFeedbackFilters = (filters: string | string[] | undefined): FeedbackFilters => {
    if (typeof filters === 'string') {
      try {
        const feedbackFilters: FeedbackFilters = JSON.parse(filters);
        Object.keys(feedbackFilters).forEach(key => {
          feedbackFilters[key].sort();
        });
        return feedbackFilters;
      } catch {
        return {};
      }
    }
    return {};
  };


  const initialStartDate = router.query.startDate
    ? new Date(router.query.startDate as string)
    : null;
  const initialEndDate = router.query.endDate
    ? new Date(router.query.endDate as string)
    : null;
  const initialFeedbackFilters = parseFeedbackFilters(router.query.feedbackFilters);
  const initialInLast = router.query.inLast as string | null;

  const [startDate, setStartDate] =
    useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] =
    useState<Date | null>(initialEndDate);
  const [feedbackFilters, setFeedbackFilters] =
    useState<FeedbackFilters>(initialFeedbackFilters);
  const [inLast, setInLast] =
    useState<string | null>(initialInLast);


  useEffect(() => {
    if (
      startDate !== initialStartDate ||
      endDate !== initialEndDate ||
      JSON.stringify(feedbackFilters) !== JSON.stringify(initialFeedbackFilters) ||
      initialInLast !== inLast
    ) {
      const formattedStart = startDate?.toISOString();

      const formattedEnd = endDate?.toISOString();

      const newQuery = { ...router.query };

      if (formattedStart) {
        newQuery.startDate = formattedStart;
      } else {
        delete newQuery.startDate;
      }

      if (formattedEnd) {
        newQuery.endDate = formattedEnd;
      } else {
        delete newQuery.endDate;
      }

      if (inLast) {
        newQuery.inLast = inLast;
        const dates = handlePredefinedRange(inLast as string);
        newQuery.startDate = dates.startDate.toISOString();
        newQuery.endDate = dates?.endDate?.toISOString();
      } else {
        delete newQuery.inLast;
      }

      if (Object.keys(feedbackFilters).length > 0) {
        newQuery.feedbackFilters = JSON.stringify(feedbackFilters);
      } else {
        delete newQuery.feedbackFilters;
      }

      router.push({
        pathname: router.pathname,
        query: newQuery,
      }).then(() => undefined);
    }
  }, [startDate, endDate, feedbackFilters, inLast]);


  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // handlePredefinedRange(event.target.value);
    setInLast(event.target.value);
  };

  const handleFeedbackSelect = (key: string, value: string, isSelected: boolean) => {
    setFeedbackFilters(prevFilters => {
      const newFilters = { ...prevFilters };

      if (isSelected) {
        if (!newFilters[key]) {
          newFilters[key] = [];
        }
        if (!newFilters[key].includes(value)) {
          newFilters[key].push(value);
        }
      } else {
        newFilters[key] = (newFilters[key] ?? []).filter(v => v !== value);
        if (newFilters[key].length === 0) {
          delete newFilters[key];
        }
      }

      return newFilters;
    });
  };

  return (
    <div>
      <AppBar breadcrumbItems={breadcrumbItems}/>
      <h1>Traces</h1>
      <div className={styles.tracesContainer}>
        <TraceTable
          projectId={projectId}
          onChange={handleDropdownChange}
          traces={traces}
        />
        <StatsPanel latencyPercentiles={latencyPercentiles}
          recordsCount={traces.length}
          feedbackCounts={feedbackCounts}
          feedbackFilters={feedbackFilters}
          onFeedbackSelect={handleFeedbackSelect}
        />
      </div>
    </div>
  );
};


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const projectId = context.params?.projectId as string;

  const { query } = context;
  let { startDate, endDate } = query;
  const { feedbackFilters, inLast } = query;

  if (inLast) {
    const dates = handlePredefinedRange(inLast as string);
    startDate = dates.startDate.toISOString();
    endDate = dates?.endDate?.toISOString();
  }

  const data = await getTraces(
    projectId,
    startDate as string,
    endDate as string,
    feedbackFilters as string
  );

  return {
    props: {
      projectId: projectId,
      traces: data.traces,
      latencyPercentiles: data.latency_percentiles,
      feedbackCounts: data.feedback_counts
    }
  };
}

export default Traces;
