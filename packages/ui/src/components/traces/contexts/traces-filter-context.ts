import React, { createContext } from 'react';

export interface FeedbackFilters {
  [key: string]: string[];
}

interface TracesFilterContextProps {
  startDate?: Date;
  endDate?: Date;
  changePending: boolean;
  setChangePending: (_: boolean) => void,
  setStartDate: (_: Date) => void,
  setEndDate: (_: Date) => void,
  setFeedbackFilters: React.Dispatch<React.SetStateAction<FeedbackFilters>>,
  feedbackFilters: FeedbackFilters;
  // inLast?: string;
}

export const TracesFilterContext = createContext<TracesFilterContextProps>({
  startDate: undefined,
  endDate: undefined,
  feedbackFilters: {},
  changePending: false,
  setChangePending: (_: boolean) => {
  },
  setStartDate: (_: Date) => {
  },
  setEndDate: (_: Date) => {
  },
  setFeedbackFilters: (_: React.SetStateAction<FeedbackFilters>) => {
  }
  // inLast: undefined
});
