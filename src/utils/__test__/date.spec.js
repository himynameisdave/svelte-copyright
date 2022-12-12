import * as dateUtils from '../date';
import * as constants from '../../constants';

describe('utils/date', () => {
  const mockDate = new Date('1990-08-08');
  const currentYear = dateUtils.today().getFullYear();

  describe('toYear', () => {
    it('returns the year value for a given date', () => {
      const actual = dateUtils.toYear(mockDate);
      expect(actual).toBe('1990');
    });
  });

  describe('formatDate', () => {
    it('handles formatting a "numeric" year', () => {
      const actual = dateUtils.formatDate(mockDate, constants.FORMAT.NUMERIC);
      expect(actual).toBe('1990');
    });

    it('handles formatting a "2-digit" year', () => {
      const actual = dateUtils.formatDate(mockDate, constants.FORMAT.TWO_DIGIT);
      expect(actual).toBe('’90');
    });

    it('does nothing if invalid format is passed', () => {
      const actual = dateUtils.formatDate(mockDate, 'haha wrong!');
      expect(actual).toBeUndefined();
    });
  });

  describe('getRange', () => {
    it('returns the first date if it is the same as second', () => {
      const year = dateUtils.toYear(mockDate);
      const actual = dateUtils.getRange(year, year);
      expect(actual).toBe(year);
    });

    it('returns the range string if different years', () => {
      const year1 = dateUtils.toYear(mockDate);
      const year2 = dateUtils.toYear(dateUtils.today());
      const actual = dateUtils.getRange(year1, year2);
      expect(actual).toBe(`${year1} - ${year2}`);
    });
  });

  describe('getDisplayDate', () => {
    describe('when showRange is true', () => {
      it('handles formatting a "numeric" year', () => {
        const actual = dateUtils.getDisplayDate({
          showRange: true,
          format: constants.FORMAT.NUMERIC,
          date: mockDate,
        });
        expect(actual).toBe(`1990 - ${currentYear}`);
      });

      it('handles formatting a "2-digit" year', () => {
        const actual = dateUtils.getDisplayDate({
          showRange: true,
          format: constants.FORMAT.TWO_DIGIT,
          date: mockDate,
        });
        expect(actual).toBe(`’90 - ’${currentYear.toString().slice(2)}`);
      });
    });

    describe('when showRange is false', () => {
      it('handles formatting a "numeric" year', () => {
        const actual = dateUtils.getDisplayDate({
          showRange: false,
          format: constants.FORMAT.NUMERIC,
          date: mockDate,
        });
        expect(actual).toBe('1990');
      });

      it('handles formatting a "2-digit" year', () => {
        const actual = dateUtils.getDisplayDate({
          showRange: false,
          format: constants.FORMAT.TWO_DIGIT,
          date: mockDate,
        });
        expect(actual).toBe('’90');
      });
    });
  });
});
