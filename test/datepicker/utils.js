const { assert } = require('chai');
const {
  getValueFromISO,
  getValueFromDate,
  getDate,
  mergeThemes,
  getSubTheme,
} = require('../../lib/datepicker/utils');

describe('ui/datepicker/utils', () => {
  describe('mergeThemes', () => {
    it('returns first theme if second one is falsey', () => {
      const baseTheme = {
        root: 'classname',
      };

      assert.deepEqual(mergeThemes(baseTheme, undefined), baseTheme);
    });

    it('joins strings if both objects contain the same key', () => {
      const baseTheme = {
        root: 'rootClass',
        clever: 'cleverClass',
      };
      const otherTheme = {
        root: 'my-own-root',
        notInBase: 'not-there',
      };

      assert.deepEqual(mergeThemes(baseTheme, otherTheme), {
        root: 'rootClass my-own-root',
        clever: 'cleverClass',
      });
    });
  });

  describe('getSubTheme', () => {
    it('returns empty object for falsy theme', () => {
      assert.deepEqual(getSubTheme(null, 'picker'), {});
    });

    it('returns object with stripped keys matching prefix', () => {
      const theme = {
        pickerRoot: 'some-class',
        pickerBaseElement: 'some-base',
        otherRoot: 'other-root',
        otherPicker: 'other-picker',
      };

      assert.deepEqual(getSubTheme(theme, 'picker'), {
        root: 'some-class',
        baseElement: 'some-base',
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
