import dayjs from 'dayjs';

export const timestampToDate = (timestamp: string, format: string) => {
  const date = new Date(timestamp);
  return dayjs(date).format(format);
};
