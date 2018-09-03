const { createElement } = require('react');
const { assert } = require('chai');
const { mount, shallow } = require('enzyme');
const { fake } = require('sinon');

const Form = require('../../lib/form').default;


describe('<Form />', () => {
  it('renders form', () => {
    const props = {
      alternativeAction: 'action',
      formError: 'Error',
    };
    const wrapper = mount(createElement(Form, props));

    assert.lengthOf(wrapper.find('form .c-form'), 1, 'form was rendered');
    assert.lengthOf(wrapper.find('div .c-form-footer'), 1, 'footer was rendered');
    assert.lengthOf(wrapper.find('strong .c-form-error'), 1, 'error was rendered');

    wrapper.unmount();
  });

  it('setPristine', () => {
    const wrapper = mount(createElement(Form));
    const instance = wrapper.instance();
    assert.isTrue(instance.state.isValid, 'default state is valild');

    instance.setValid(false);
    assert.isFalse(instance.state.isValid, 'state was changed');

    instance.setPristine();
    assert.deepEqual(instance.state, instance.getDefaultState(), 'state is back to default');

    wrapper.unmount();
  });

  it('setValid', () => {
    const wrapper = mount(createElement(Form));
    const instance = wrapper.instance();
    const doneFake = fake();

    assert.isTrue(instance.state.isValid, 'default state is valild');

    instance.setValid(false, doneFake);

    assert.equal(doneFake.callCount, 1, 'callback was called');
    assert.isFalse(instance.state.isValid, 'state was changed');

    wrapper.unmount();
  });

  it('isDisabled', () => {
    // this.props.locked is true
    const props = { locked: true };
    const wrapperWithLock = mount(createElement(Form, props));
    const instanceWithLock = wrapperWithLock.instance();
    assert.isTrue(instanceWithLock.isDisabled(), 'form is disabled if locked is true');
    wrapperWithLock.unmount();

    // this.state.isValid is false
    const wrapper = mount(createElement(Form));
    const instance = wrapper.instance();

    instance.setValid(false);
    assert.isTrue(instance.isDisabled(), 'form is disabled if state is not valid');
    wrapper.unmount();
  });

  it('reset', () => {
    const wrapper = mount(createElement(Form));
    const instance = wrapper.instance();
    assert.isTrue(instance.state.isValid, 'default state is valild');

    instance.setValid(false);
    assert.isFalse(instance.state.isValid, 'state was changed');

    instance.reset();
    assert.deepEqual(instance.state, instance.getDefaultState(), 'state is back to default');
    wrapper.unmount();
  });

  it('submit', () => {
    const preventDefault = fake();
    const wrapper = shallow(createElement(Form));

    wrapper.find('form').simulate('submit', { preventDefault });
    const onSubmit = wrapper.props().onSubmit;

    assert.equal(preventDefault.callCount, 1, 'preventDefault was called');
    assert.exists(onSubmit, 'onSubmit prop exists');
    assert.typeOf(onSubmit, 'function', 'onSubmit must be a funciton');
  });
});
