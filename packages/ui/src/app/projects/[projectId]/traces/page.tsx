import { getTraces } from '@/services/trace-service';
import TracesPage from '@/components/traces/traces-page';
import parseFeedbackFilters from '@/components/traces/helpers/parse-feedback-filters';
import { convertRangeToDateRange } from '@/components/traces/helpers/handle-predefined-range';

export const metadata = {
  title: 'Langscout | Traces',
};

export default async function Traces({ params, searchParams }:
  {
    params: {
      projectId: string
    },
    searchParams: {
      startDate?: string,
      endDate?: string,
      feedbackFilters?: string
      inLast?: string
    }
  }) {

  let startDate: string | undefined;
  let endDate: string | undefined;

  // Convert endDate to be undefined if it is empty
  if (searchParams.inLast) {
    const dates = convertRangeToDateRange(searchParams.inLast as string);
    startDate = dates.startDate.toISOString();
    endDate = dates.endDate.toISOString();
  } else if (searchParams.startDate || searchParams.endDate) {
    startDate = searchParams.startDate;
    endDate = searchParams.endDate;
  }

  const { traces, latency_percentiles, feedback_counts } = await getTraces(
    params.projectId,
    startDate ?? new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endDate,
    searchParams.feedbackFilters
  );

  const convertedStartDate = startDate
    ? new Date(startDate)
    : undefined;
  const convertedEndDate = endDate
    ? new Date(endDate)
    : undefined;
  const convertedFeedbackFilters = searchParams.feedbackFilters
    ? parseFeedbackFilters(searchParams.feedbackFilters)
    : {};

  return <TracesPage
    projectId={params.projectId}
    startDate={convertedStartDate}
    endDate={convertedEndDate}
    feedbackFilters={convertedFeedbackFilters}
    traces={traces}
    latency_percentiles={latency_percentiles}
    feedback_counts={feedback_counts}
  />;
}
