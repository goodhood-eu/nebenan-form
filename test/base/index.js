const { createElement } = require('react');
const { assert } = require('chai');
const { shallow, mount } = require('enzyme');
const { fake } = require('sinon');

const Base = require('../../lib/base').default;
const Form = require('../../lib/form');

const {
  parseValidations,
  getRegexValidation,
} = require('../../lib/base');


class Child extends Base {
  render() { return null; }
}

describe('Base', () => {
  it('prop:defaultValue', () => {
    const props = { defaultValue: 'captain' };
    const instance = shallow(createElement(Child, props)).instance();
    const noDefaultValue = shallow(createElement(Child)).instance();

    assert.equal(noDefaultValue.getValue(), null, 'null by default');
    assert.equal(instance.getValue(), 'captain', 'default value is set');
  });

  it('isConnected', () => {
    const props = { name: 'name' };

    const withForm = mount(
      createElement(Form, null,
        createElement(Child, props),
      ),
    );

    const noName = mount(
      createElement(Form, null,
        createElement(Child),
      ),
    );

    const noForm = mount(
      createElement(Child, props),
    );

    const noFormNoName = mount(
      createElement(Child),
    );

    assert.isTrue(withForm.find(Child).instance().isConnected(), 'connected if with name and in form');
    assert.isFalse(noName.find(Child).instance().isConnected(), 'not connected if no name but in form');
    assert.isFalse(noForm.instance().isConnected(), 'not connected if with name but not in form');
    assert.isFalse(noFormNoName.instance().isConnected(), 'not connected if no name and not in form');

    withForm.unmount();
    noName.unmount();
    noForm.unmount();
    noFormNoName.unmount();
  });

  it('getValidations', () => {
    const noValidation = Base.prototype.getValidations({});

    assert.equal(noValidation.syncValidations.length, 0, 'no sync validations');
    assert.equal(noValidation.customValidation, null, 'no custom validation');

    const props = {
      required: true,
      pattern: 'test',
      validate: 'isEmail;isInt',
    };

    const withValidation = Base.prototype.getValidations(props);

    assert.equal(withValidation.syncValidations.length, 4, 'four sync validations');
    assert.equal(withValidation.customValidation, null, 'no custom validation');

    const customValidationProps = {
      required: true,
      pattern: 'test',
      validate: () => true,
    };

    const customValidation = Base.prototype.getValidations(customValidationProps);

    assert.equal(customValidation.syncValidations.length, 2, 'two sync validations');
    assert.equal(customValidation.customValidation, customValidationProps.validate, 'with custom validation');
  });

  it('getValidation', () => {
    const props = {
      required: true,
      pattern: '[0-9]*',
      validate: (value) => value.length === 5,
    };

    const instance = shallow(createElement(Child, props)).instance();

    return Promise.all([
      assert.isRejected(instance.getValidation(), null, null, 'no value'),
      assert.isRejected(instance.getValidation('aaaaaa'), null, null, 'no pattern match'),
      assert.isRejected(instance.getValidation('123'), null, null, 'validate not passed'),
      assert.isFulfilled(instance.getValidation('12345'), null, null, 'correct value'),
    ]);
  });

  it('setValue', () => {
    const props = {
      onUpdate: fake(),
    };

    const doneFake = fake();
    const instance = shallow(createElement(Child, props)).instance();

    instance.setValue('value', doneFake);
    assert.equal(instance.getValue(), 'value', 'value was updated');
    assert.equal(props.onUpdate.callCount, 1, 'on update was called');
    assert.equal(doneFake.callCount, 1, 'callback was called');

    instance.setValue('new value', doneFake, { silent: true });
    assert.equal(instance.getValue(), 'new value', 'value was updated');
    assert.equal(props.onUpdate.callCount, 1, 'on update was not called');
    assert.equal(doneFake.callCount, 2, 'callback was called');
  });

  it('setError', () => {
    const props = {
      onError: fake(),
    };

    const doneFake = fake();
    const instance = shallow(createElement(Child, props)).instance();

    instance.setError('Error', doneFake);
    assert.equal(instance.getError(), 'Error', 'error was set');
    assert.equal(props.onError.callCount, 1, 'on error was called');
    assert.equal(doneFake.callCount, 1, 'callback was called');
  });

  it('setPristine', () => {
    const instance = shallow(createElement(Child)).instance();
    instance.setValue('value');
    instance.setError('Error');

    assert.equal(instance.getValue(), 'value', 'value was updated');
    assert.isFalse(instance.isPristine(), 'not pristine');
    assert.isFalse(instance.isValid(), 'not valid');
    assert.equal(instance.getError(), 'Error', 'with error');

    instance.setPristine();

    assert.equal(instance.getValue(), 'value', 'value is same');
    assert.isTrue(instance.isPristine(), 'pristine');
    assert.isTrue(instance.isValid(), 'valid');
    assert.equal(instance.getError(), null, 'no error');
  });

  it('reset', () => {
    const props = { defaultValue: 'messi' };
    const instance = shallow(createElement(Child, props)).instance();
    instance.setValue('value');
    instance.setError('Error');

    assert.equal(instance.getValue(), 'value', 'value was updated');
    assert.isFalse(instance.isPristine(), 'not pristine');
    assert.isFalse(instance.isValid(), 'not valid');
    assert.equal(instance.getError(), 'Error', 'with error');

    instance.reset();

    assert.deepEqual(instance.state, instance.getDefaultState(props), 'state is default');
  });

  it('actionChange', () => {
    const callback = fake();
    const instance = shallow(createElement(Child)).instance();
    const action = instance.actionChange(callback);

    action({ target: { value: 'value' } });

    assert.equal(instance.getValue(), 'value', 'value was updated');
    assert.equal(callback.callCount, 1, 'callback was called');
  });

  it('actionClearError', () => {
    const callback = fake();
    const instance = shallow(createElement(Child)).instance();
    const action = instance.actionClearError(callback);

    action();

    assert.equal(instance.getError(), null, 'error was cleared');
    assert.equal(callback.callCount, 1, 'callback was called');
  });

  it('actionValidate', (done) => {
    const callback = fake();
    const props = { required: true, error: 'Error' };
    const instance = shallow(createElement(Child, props)).instance();
    const action = instance.actionValidate(callback);

    const check = () => {
      assert.equal(instance.getError(), 'Error', 'error was set');
      assert.equal(callback.callCount, 1, 'callback was called');
      done();
    };

    action();
    // Wait validation promises
    setTimeout(check, 300);
  });
});

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
