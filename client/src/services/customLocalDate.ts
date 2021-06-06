export function customLocalDate(date: Date) {
  let tzOffset = date.getTimezoneOffset() * 60 * 1000;
  let dateLocal = new Date(date.getTime() - tzOffset);
  return dateLocal.toISOString().split('T')[0];
}

export function customLocalTime(date: Date) {
  return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
}
