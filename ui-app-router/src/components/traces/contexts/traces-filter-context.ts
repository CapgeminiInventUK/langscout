import { createContext } from 'react';

interface TracesFilterContextProps {
  startDate?: Date;
  endDate?: Date;
  setStartDate: (date: Date) => void,
  setEndDate: (date: Date) => void,
  // feedbackFilters?: { [key: string]: string[] }; // TODO FeedbackFilters
  // inLast?: string;
}

//TODO Move to a separate file
export const TracesFilterContext = createContext<TracesFilterContextProps>({
  startDate: undefined,
  endDate: undefined,
  setStartDate: (_: Date) => {
  },
  setEndDate: (_: Date) => {
  },
  // feedbackFilters: undefined,
  // inLast: undefined
});
