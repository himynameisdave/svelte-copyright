import {
  afterEach, beforeEach, describe, expect, it, vi,
} from 'vitest';
import {
  formatDate, getDisplayDate, getRange, toYear, today,
} from './date.js';
import { FORMAT } from '../constants.js';

describe('utils/date', () => {
  const mockDate = new Date('1990-08-08');

  //  Pin "now" so these tests don't rot as the years roll over.
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2021-05-29'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('today', () => {
    it('returns the current date', () => {
      expect(today().getFullYear()).toBe(2021);
    });
  });

  describe('toYear', () => {
    it('returns the year value for a given date', () => {
      expect(toYear(mockDate)).toBe('1990');
    });

    it('falls back to the current year', () => {
      expect(toYear()).toBe('2021');
    });
  });

  describe('formatDate', () => {
    it('handles formatting a "numeric" year', () => {
      expect(formatDate(mockDate, FORMAT.NUMERIC)).toBe('1990');
    });

    it('handles formatting a "2-digit" year', () => {
      expect(formatDate(mockDate, FORMAT.TWO_DIGIT)).toBe('’90');
    });

    it('defaults to the "numeric" format', () => {
      expect(formatDate(mockDate)).toBe('1990');
    });
  });

  describe('getRange', () => {
    it('joins two different years', () => {
      expect(getRange('1990', '2021')).toBe('1990 - 2021');
    });

    it('collapses matching years down to one', () => {
      expect(getRange('2021', '2021')).toBe('2021');
    });
  });

  describe('getDisplayDate', () => {
    it('just returns the year when showRange is false', () => {
      expect(getDisplayDate({ date: mockDate })).toBe('1990');
    });

    it('returns the date range when showRange is true', () => {
      expect(getDisplayDate({
        date: mockDate,
        showRange: true,
      })).toBe('1990 - 2021');
    });

    it('returns the year when showRange is true, but the given year is the current year', () => {
      expect(getDisplayDate({ showRange: true })).toBe('2021');
    });

    it('respects the format when showing a range', () => {
      const actual = getDisplayDate({
        date: mockDate,
        showRange: true,
        format: FORMAT.TWO_DIGIT,
      });
      expect(actual).toBe('’90 - ’21');
    });
  });
});
