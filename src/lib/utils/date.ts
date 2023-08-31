import type { Format } from '$lib/types.js';
import { FORMAT } from '../constants.js';

//  Returns new Date() - for default/fallback values.
export function today(): Date {
  return new Date();
}

//  Gets the year string from a date.
export function toYear(date = today()): string {
  return date.getFullYear().toString();
}

/**
 * Formats the date, just for you!
 *
 * @param {Date} date - Date to format
 * @param {'numeric' | '2-digit'} format - Format for the date.
 */
export function formatDate(date = today(), format: Format = FORMAT.NUMERIC): string {
  if (format === FORMAT.TWO_DIGIT) {
    return `’${toYear(date).slice(-2)}`;
  }
  return toYear(date);
}

/**
 * Returns the "range string", unless the dates are the same.
 *
 * @param {string} date1 - First date (formatted to a string)
 * @param {string} date2 - Second date (formatted to a string).
 */
export function getRange(date1: string, date2: string): string {
  //  Don't show a range if years are the same, as that would be dumb.
  if (date1 === date2) {
    return date1;
  }
  return `${date1} - ${date2}`;
}

type GetDisplayDateProps = {
  showRange?: boolean;
  date?: Date;
  format?: Format;
};

/**
 * Returns the displayed date for the component.
 *
 * @param {boolean} options.showRange - If a date range should be displayed.
 * @param {Date} options.date - Copyright year to be used. If showRange is true, this is the start year of the range.
 * @param {'numeric' | '2-digit'} options.format - Date format to be used.
 */
export function getDisplayDate({
  showRange = false,
  date = today(),
  format = FORMAT.NUMERIC,
}: GetDisplayDateProps): string {
  const formatted = formatDate(date, format);
  //  Early return if we don't show the range
  if (!showRange) {
    return formatted;
  }
  //  Get today's year, formatted correctly.
  const formattedToday = formatDate(today(), format);
  if (!formattedToday || formattedToday === 'NaN') {
    return today().toLocaleDateString();
  }
  return getRange(formatted, formattedToday);
}
