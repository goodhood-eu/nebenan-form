const { assert } = require('chai');

const {
  cleanValue,
  formatValue,
  increaseValue,
  decreaseValue,
  getCaretPosition,
} = require('../../lib/time/utils');


describe('time/utils', () => {
  it('cleanValue', () => {
    assert.equal(cleanValue('12:12'), '1212', 'remove semicolon');
    assert.equal(cleanValue('1123213:2:12'), '1123213212', 'remove multiple semicolons');
    assert.equal(cleanValue('as2%:11k$2'), 'as2%11k$2', 'remove only semicolon');
  });

  it('formatValue', () => {
    assert.equal(formatValue('1212'), '12:12', 'add semicolon');
    assert.equal(formatValue('233'), '23:3', 'add semicolon for 3 numbers');

    assert.equal(formatValue('12'), '12', 'do not add semicolon if only 2 numbers');
    assert.equal(formatValue('2'), '2', 'do not add semicolon if only 1 number');

    assert.equal(formatValue('1123213123'), '11:23', 'limit length');
  });

  it('increaseValue', () => {
    const caretPositionsForHours = [0, 1, 2];
    const caretPositionsForMinutes = [3, 4];

    caretPositionsForHours.forEach((caretPosition) => {
      assert.equal(increaseValue('11:12', caretPosition), '12:12', `increase hours at ${caretPosition}`);
    });

    caretPositionsForMinutes.forEach((caretPosition) => {
      assert.equal(increaseValue('11:12', caretPosition), '11:13', `increase minutes at ${caretPosition}`);
    });

    assert.equal(increaseValue('23:12', 0), '23:12', 'do not change hours after 23');
    assert.equal(increaseValue('25:12', 0), '23:12', 'retirict hours');

    assert.equal(increaseValue('23:59', 3), '23:59', 'do not change minutes after 59');
    assert.equal(increaseValue('23:88', 3), '23:59', 'retirict minutes');
  });

  it('decreaseValue', () => {
    const caretPositionsForHours = [0, 1, 2];
    const caretPositionsForMinutes = [3, 4];

    caretPositionsForHours.forEach((caretPosition) => {
      assert.equal(decreaseValue('11:12', caretPosition), '10:12', `decrease hours at ${caretPosition}`);
    });

    caretPositionsForMinutes.forEach((caretPosition) => {
      assert.equal(decreaseValue('11:12', caretPosition), '11:11', `decrease minutes at ${caretPosition}`);
    });

    assert.equal(decreaseValue('00:12', 0), '0:12', 'do not change hours after 0');
    assert.equal(decreaseValue('23:00', 3), '23:0', 'do not change minutes after 0');
  });

  it('getCaretPosition', () => {
    const oldValue = 'hello';
    const newValue = 'hello world';

    assert.equal(getCaretPosition(1, oldValue, newValue), 1, 'do not change caret if it was not at the end');
    assert.equal(getCaretPosition(5, oldValue, newValue), 11, 'move caret to end if it was at the end');
  });
});
