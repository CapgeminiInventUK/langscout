import { getTraces } from '@/services/trace-service';
import TracesPage from '@/components/traces/traces-page';


export default async function Traces({ params, searchParams }:
  {
    params: {
      projectId: string
    },
    searchParams: {
      startDate?: string,
      endDate?: string,
      // feedbackFilters?: string
      // inLast?: string
    }
  }) {

  // if (inLast) {
  //     const dates = handlePredefinedRange(inLast as string);
  //     startDate = dates.startDate.toISOString();
  //     endDate = dates?.endDate?.toISOString();
  //   }

  const { traces, latency_percentiles, feedback_counts } = await getTraces(
    params.projectId,
    searchParams.startDate,
    searchParams.endDate,
    undefined
  );

  const convertedStartDate = searchParams.startDate ? new Date(searchParams.startDate) : undefined;
  const convertedEndDate = searchParams.endDate ? new Date(searchParams.endDate) : undefined;

  return <TracesPage
    projectId={params.projectId}
    startDate={convertedStartDate}
    endDate={convertedEndDate}
    traces={traces}
    latency_percentiles={latency_percentiles}
    feedback_counts={feedback_counts}

  />;
}
