import { assert } from 'chai';
import {
  arrayOf,
  getMonth,
  getMonthLabel,
  getMonthDetails,
} from '../lib/utils';

describe('utils', () => {
  describe('arrayOf', () => {
    it('returns array with ascending numbers', () => {
      assert.deepEqual(arrayOf(3), [0, 1, 2]);
    });
  });
  describe('getMonth', () => {
    it('returns start of first day in given dates month', () => {
      const date = new Date('December 17, 1995 03:24:00');
      assert.deepEqual(getMonth(date), new Date(1995, 11, 1, 0, 0, 0));
    });
  });
  describe('getMonthLabel', () => {
    it('returns combination of month and year', () => {
      const locale = { monthLabels: ['Jan', 'Feb'] };

      assert.equal(getMonthLabel(new Date(1994, 0, 1), locale), 'Jan 1994');
      assert.equal(getMonthLabel(new Date(2055, 1, 1), locale), 'Feb 2055');
    });
  });
  describe('getMonthDetails', () => {
    it('returns number of days in month', () => {
      const { days } = getMonthDetails(new Date(2004, 1));
      assert.equal(days, 29);
    });
    it('returns number of days in first week which belong to previous month', () => {
      const { offset } = getMonthDetails(new Date(2020, 3));
      assert.equal(offset, 2);
    });
  });
});
