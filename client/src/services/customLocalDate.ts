export function customLocalDate(date: Date) {
  let tzOffset = date.getTimezoneOffset() * 60 * 1000;
  let dateLocal = new Date(date.getTime() - tzOffset);
  return dateLocal.toISOString().split('T')[0];
}

export function customLocalTime(date: Date) {
  return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
}

// Function to check if date is within the last two weeks - used in reportDetails - returns boolean
export function customStringToDate(date: String, timeLimit) {
  let dateofsurvey = date.split('T')[0];
  let firstDate = Date.parse(dateofsurvey);
  const oneDay = 24 * 60 * 60 * 1000;

  const diffDays = Math.round(
    Math.abs((firstDate - new Date().getTime()) / oneDay),
  );
  return diffDays < timeLimit;
}
