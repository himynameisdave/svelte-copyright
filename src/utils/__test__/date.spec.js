import * as dateUtils from '../date';
import * as constants from '../../constants';


describe('utils/date', () => {
  const mockDate = new Date('1990-08-08');

  describe('toYear', () => {
    it('returns the year value for a given date', () => {
      const actual = dateUtils.toYear(mockDate);
      expect(actual).toBe('1990');
    });
  });

  describe('withFormatGetDate', () => {
    it('handles formatting a "numeric" year', () => {
      const formatDate = dateUtils.withFormatGetDate(constants.FORMAT.NUMERIC);
      const actual = formatDate(mockDate);
      expect(actual).toBe('1990');
    });
    it('handles formatting a "2-digit" year', () => {
      const formatDate = dateUtils.withFormatGetDate(constants.FORMAT.TWO_DIGIT);
      const actual = formatDate(mockDate);
      expect(actual).toBe('’90');
    });
  });

  describe('withGetDateRange', () => {
    it('it will just return the year when showRange is false', () => {
      const getDateRange = dateUtils.withGetDateRange(false);
      const actual = getDateRange(mockDate, dateUtils.toYear);
      expect(actual).toBe('1990');
    });
    //  TODO: this test will break in 2022
    it('it will return the date range when showRange is true', () => {
      const getDateRange = dateUtils.withGetDateRange(true);
      const actual = getDateRange(mockDate, dateUtils.toYear);
      expect(actual).toBe('1990 - 2021');
    });
    //  TODO: this test will break in 2022
    it('it will return the year when showRange is true, but the given year is the current year', () => {
      const getDateRange = dateUtils.withGetDateRange(true);
      const actual = getDateRange(undefined, dateUtils.toYear);
      expect(actual).toBe('2021');
    });
  });
});
