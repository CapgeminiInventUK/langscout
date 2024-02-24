import { FeedbackFilters } from '@/components/traces/contexts/traces-filter-context';

export default function parseFeedbackFilters(
  filters: string | string[] | undefined
): FeedbackFilters {
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
