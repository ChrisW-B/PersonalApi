const relativeTimeDifference = previous => {
  // based on http://stackoverflow.com/a/6109105/6465731
  const current = new Date();
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;
  const elapsed = current - previous;
  let value = 0;
  let unit = '';
  if (elapsed < msPerMinute) {
    value = Math.round(elapsed / 1000);
    unit = 'second';
  } else if (elapsed < msPerHour) {
    value = Math.round(elapsed / msPerMinute);
    unit = 'minute';
  } else if (elapsed < msPerDay) {
    value = Math.round(elapsed / msPerHour);
    unit = 'hour';
  } else if (elapsed < msPerMonth) {
    value = `${Math.round(elapsed / msPerDay)}`;
    unit = 'day';
  } else if (elapsed < msPerYear) {
    value = `${Math.round(elapsed / msPerMonth)}`;
    unit = 'month';
  } else {
    value = `${Math.round(elapsed / msPerYear)}`;
    unit = 'year';
  }
  if (value !== 1) {
    unit += 's';
  }
  return `${value} ${unit} ago`;
};

export default relativeTimeDifference;
