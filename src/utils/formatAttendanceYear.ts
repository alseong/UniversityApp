export const formatAttendanceYear = (value: string): string => {
  const match = value.match(/\d{4}/);
  return match ? match[0] : value;
};
