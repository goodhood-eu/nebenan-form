const { assert } = require('chai');
const {
  getValueFromISO,
  getValueFromDate,
  getDate,
  getCalendarTheme,
} = require('../../lib/datepicker/utils');

describe('ui/datepicker/utils', () => {
  describe('getCalendarTheme', () => {
    it('merges base theme with calendar prefixed keys from passed theme', () => {
      const baseCalendarTheme = {
        root: 'base-root',
        clever: 'base-clever',
      };
      const passedTheme = {
        calendarRoot: 'my-root',
        blubb: 'my-blubb',
      };
      assert.deepEqual(getCalendarTheme(baseCalendarTheme, passedTheme), {
        root: 'base-root my-root',
        clever: 'base-clever',
      });
    });
  });

  describe('getValueFromISO', () => {
    it('returns empty string for falsey values', () => {
      assert.equal(getValueFromISO(null, 'yyyy'), '');
      assert.equal(getValueFromISO(undefined, 'yyyy'), '');
    });

    it('returns date in given date format', () => {
      assert.equal(getValueFromISO('2011-01-01', 'yyyy'), '2011');
    });
  });

  describe('getValueFromDate', () => {
    it('returns empty string for falsey values', () => {
      assert.equal(getValueFromDate(null), '');
    });

    it('returns ISO date', () => {
      assert.equal(getValueFromDate(new Date(2011, 1, 2)), '2011-02-02');
    });
  });

  describe('getDate', () => {
    it('returns null for falsey values', () => {
      assert.isNull(getDate(null));
    });

    it('returns date if given date is a date object', () => {
      assert.deepEqual(getDate(new Date(2011, 1, 2)), new Date(2011, 1, 2));
    });

    it('returns date for given iso date', () => {
      assert.deepEqual(getDate('2011-02-02'), new Date(2011, 1, 2));
    });
  });
});
