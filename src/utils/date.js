import { FORMAT } from '../constants';

//  Returns new Date() - for default/fallback values.
export function today() {
  return new Date();
}

//  Gets the year string from a date.
export function toYear(date = today()) {
  return date.getFullYear().toString();
}

//  HOF which is injected with the format and returns the date formatter function.
export function withFormatGetDate(format = FORMAT.NUMERIC) {
  return function formatDate(date = today()) {
    if (format === FORMAT.NUMERIC) {
      return toYear(date);
    }
    if (format === FORMAT.TWO_DIGIT) {
      return `’${toYear(date).slice(-2)}`;
    }
  }
}

//  A default for the getDateRange formatter.
function defaultFormatDate(date) {
  return date;
}

//  HOF which is injected with the showRange and returns a getDateRange function.
export function withGetDateRange(showRange = false) {
  return function getDateRange(date = today(), formatDate = defaultFormatDate) {
    const formattedToday = formatDate(today());
    const formattedDate = formatDate(date);
    if (showRange && formattedToday !== formattedDate) { // Make sure that if it's a range, the two years aren't the same.
      return [
        formattedDate,
        formattedToday
      ].join(' - ');
    }
    return formattedDate;
  }
}
