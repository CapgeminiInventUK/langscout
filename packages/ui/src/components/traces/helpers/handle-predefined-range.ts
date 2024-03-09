interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function handlePredefinedRange(
  range: string,
  setStartDate: (_: Date) => void,
  setEndDate: (_: Date) => void,
  setChangePending: (_: boolean) => void
) {
  setChangePending(true);

  const { startDate, endDate } = convertRangeToDateRange(range);

  setStartDate(startDate);
  setEndDate(endDate);
}

export function convertRangeToDateRange(range: string): DateRange {
  const now = new Date();
  if (range === '1h') {
    return { startDate: new Date(now.getTime() - 60 * 60 * 1000), endDate: now };
  } else if (range === '3h') {
    return { startDate: new Date(now.getTime() - 3 * 60 * 60 * 1000), endDate: now };
  } else if (range === '12h') {
    return { startDate: new Date(now.getTime() - 12 * 60 * 60 * 1000), endDate: now };
  } else if (range === '24h') {
    return { startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000), endDate: now };
  } else if (range === '7d') {
    return { startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), endDate: now };
  } else if (range === '14d') {
    return { startDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), endDate: now };
  } else if (range === '30d') {
    return { startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), endDate: now };
  } else if (range === '90d') {
    return { startDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000), endDate: now };
  } else {
    throw new Error('Invalid range ' + range);
  }
}
