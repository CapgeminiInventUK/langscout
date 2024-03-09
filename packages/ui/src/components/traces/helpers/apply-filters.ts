import { ReadonlyURLSearchParams } from 'next/navigation';
import { FeedbackFilters } from '@/components/traces/contexts/traces-filter-context';

export function applyFilters(
  replace: (url: string) => void,
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  feedbackFilters: FeedbackFilters,
  setChangePending: (changePending: boolean) => void,
  startDate?: Date,
  endDate?: Date,
) {
  const params = new URLSearchParams(searchParams);

  if (startDate !== undefined) {
    params.set('startDate', startDate.toISOString());
  } else {
    params.delete('startDate');
  }

  if (endDate !== undefined) {
    params.set('endDate', endDate.toISOString());
  } else {
    params.delete('endDate');
  }

  if (Object.keys(feedbackFilters).length > 0) {
    params.set('feedbackFilters', JSON.stringify(feedbackFilters));
  } else {
    params.delete('feedbackFilters');
  }

  setChangePending(false);
  replace(`${pathname}?${params.toString()}`);
}
