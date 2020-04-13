const { assert } = require('chai');

const {
  isTimeFormat,
  formatValue,
  transformValue,
  getCaretPosition,
} = require('../../lib/time/utils');


describe('time/utils', () => {
  it('isTimeFormat', () => {
    const trueValues = [
      '12',
      '12:2',
      '12:02',
      '01:12',
      '12:52',
      '12:',
      '1:',
      ':1',
      ':12',
      ':',
      '01',
      '1',
    ];

    const falseValues = [
      '12323sad',
      '1232133',
      '123',
      '1234',
      '12:1b',
      'a1:12',
      '132:12',
      '123:1233',
      '13:1233',
      'asd45%#',
    ];

    trueValues.forEach((value) => {
      assert.isTrue(isTimeFormat(value), `valid format: ${value}`);
    });

    falseValues.forEach((value) => {
      assert.isFalse(isTimeFormat(value), `invalid format: ${value}`);
    });
  });

  it('formatValue', () => {
    assert.equal(formatValue('1212'), '12:12', 'add colon');
    assert.equal(formatValue('233'), '23:3', 'add colon for 3 numbers');

    assert.equal(formatValue('12'), '12', 'do not add colon if only 2 numbers');
    assert.equal(formatValue('2'), '2', 'do not add colon if only 1 number');

    assert.equal(formatValue('12:'), '12:', 'do not remove colon for 2 numbers');
    assert.equal(formatValue('12:1'), '12:1', 'do not remove colon for 3 numbers');
    assert.equal(formatValue('12:14'), '12:14', 'do not remove colon for 4 numbers');

    assert.equal(formatValue('1123213123'), '11:23', 'limit length');
  });

  it('transformValue', () => {
    assert.equal(transformValue('11:12', false, 1), '12:12', 'increase hours');
    assert.equal(transformValue('11:12', true, 1), '11:13', 'increase minutes');
    assert.equal(transformValue('11:12', false, -1), '10:12', 'decrease hours');
    assert.equal(transformValue('11:12', true, -1), '11:11', 'decrease minutes');

    assert.equal(transformValue('23:12', false, 1), '23:12', 'do not increase hours after 23');
    assert.equal(transformValue('25:12', false, 1), '23:12', 'bottom bound - hours');

    assert.equal(transformValue('23:59', true, 1), '23:59', 'do not increase minutes after 59');
    assert.equal(transformValue('23:88', true, 1), '23:59', 'bottom bound - minutes');

    assert.equal(transformValue('00:12', false, -1), '00:12', 'do not decrease hours after 0');
    assert.equal(transformValue('23:00', true, -1), '23:00', 'do not decrease minutes after 0');

    assert.equal(transformValue('11', false, 1), '12', 'do not add colon');

    assert.equal(transformValue('1', false, 1), '02', 'pad hours');
    assert.equal(transformValue('12:3', true, 1), '12:04', 'pad minutes');
  });

  it('getCaretPosition', () => {
    const oldValue = 'hello';
    const newValue = 'hello world';

    assert.equal(getCaretPosition(1, oldValue, newValue), 1, 'do not change caret if it was not at the end');
    assert.equal(getCaretPosition(5, oldValue, newValue), 11, 'move caret to end if it was at the end');
  });
});
