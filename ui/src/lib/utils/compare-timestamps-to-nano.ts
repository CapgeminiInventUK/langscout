export function compareTimestamps(ts1: string, ts2: string): number {
  // Extract the millisecond part and the nanosecond part
  const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3})(\d*)Z/;
  const match1 = ts1.match(regex);
  const match2 = ts2.match(regex);

  if (!match1 || !match2) throw new Error('Invalid timestamp format');

  const date1 = new Date(match1[1] + 'Z');
  const date2 = new Date(match2[1] + 'Z');
  const nano1 = parseInt(match1[2].padEnd(6, '0'), 10); // Pad to ensure microseconds
  const nano2 = parseInt(match2[2].padEnd(6, '0'), 10);

  // First compare the millisecond part
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;

  // Then compare the nanosecond part, if milliseconds are equal
  if (nano1 > nano2) return 1;
  if (nano1 < nano2) return -1;

  // Dates are exactly equal
  return 0;
}
