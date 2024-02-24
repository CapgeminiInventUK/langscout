import { ReadonlyURLSearchParams } from 'next/navigation';

export function applyFilters(
  replace: (url: string) => void,
  pathname: string,
  searchParams: ReadonlyURLSearchParams,
  startDate?: Date, endDate?: Date) {
  const params = new URLSearchParams(searchParams);

  if (startDate) {
    params.set('startDate', startDate.toISOString());
  } else {
    params.delete('startDate');
  }

  if (endDate) {
    params.set('endDate', endDate.toISOString());
  } else {
    params.delete('endDate');
  }
  replace(`${pathname}?${params.toString()}`);
}
