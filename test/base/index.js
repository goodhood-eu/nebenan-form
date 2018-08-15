const { createElement } = require('react');
const { assert } = require('chai');
const { shallow, mount } = require('enzyme');
const { fake } = require('sinon');


const Base = require('../../lib/base').default;
const Form = require('../../lib/form').default;


class Child extends Base {
  render() { return null; }
}

describe('Base', () => {
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
    process.nextTick(check);
  });
});
