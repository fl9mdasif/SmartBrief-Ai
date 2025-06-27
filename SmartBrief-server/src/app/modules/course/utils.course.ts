// Define a function to calculate the duration in weeks
export const calculateDurationInWeeks = (
  startDate: string | number | Date,
  endDate: string | number | Date,
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDifference = Math.abs(end.getTime() - start.getTime());
  const durationInWeeks = Math.ceil(timeDifference / (1000 * 60 * 60 * 24 * 7));
  return durationInWeeks;
};
