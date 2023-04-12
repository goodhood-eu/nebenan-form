const { assert } = require('chai');
const {
  parseValidations,
  getRegexValidation,
} = require('../../lib/base');

describe('base/help functions', () => {
  it('parseValidations', () => {
    assert.deepEqual(parseValidations(''), [], 'returns empty array if value is empty string');
    assert.deepEqual(parseValidations(null), [], 'returns empty array if value is null');
    assert.deepEqual(parseValidations(undefined), [], 'returns empty array if value is undefined');

    assert.throws(() => parseValidations(5), 'Validation must be a string');
    assert.throws(() => parseValidations([5, 7, 9]), 'Validation must be a string');
    assert.throws(() => parseValidations({ 1: 'one', 2: 'two' }), 'Validation must be a string');

    assert.deepEqual(parseValidations('isRequired'), [], 'returns empty array if the value is isRequired');
    assert.deepEqual(parseValidations('isRegex'), [], 'returns empty array if the value is isRegex');

    assert.lengthOf(parseValidations('isInt;isRequired;isRegex'), 1, 'returns an array with one element, will ignore isRegex and isRequired');
    assert.lengthOf(parseValidations('isInt;isLength:0,5'), 2, 'returns an array with two elements');

    const result = parseValidations('isLength:0,5');
    assert.lengthOf(result, 1, 'returns an array with one element');
    assert.isFunction(result[0], 'the only element of the result array of parseValidations is a function');

    assert.isTrue(result[0]('abc'), 'value is in the interval from 0 to 5');
    assert.isFalse(result[0](null), 'null returns flase');
    assert.isFalse(result[0]('abcdefg'), 'value is not in the interval from 0 to 5');

    const isNumber = parseValidations('isNumber');
    assert.isTrue(isNumber[0](7), '7 is a number');
    assert.isFalse(isNumber[0]('string'), 'string is not a number');

    const [isTime] = parseValidations('isTime');
    assert.isTrue(isTime('12:46'), '12:46 is valid time');
    assert.isFalse(isTime('asdasd'), 'string is not a time');

    const [isRestrictedTime] = parseValidations('isTime:01:00,19:00');
    assert.isFalse(isRestrictedTime('00:46'), '00:46 is less than mininmum value');
    assert.isFalse(isRestrictedTime('21:24'), '21:24 is more than maximum value');
  });

  it('getRegexValidation', () => {
    assert.isFunction(getRegexValidation(/g\(\)/), 'return a function if the value is regexp');
    assert.isFunction(getRegexValidation(null), 'returns a function if the value is null');

    const isRegex = getRegexValidation('abc');
    assert.isTrue(isRegex('abc'), 'value match regexp');
    assert.isFalse(isRegex('abb'), 'value doesnt match regexp');
  });
});
