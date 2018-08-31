const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');
const { fake } = require('sinon');

const Form = require('../../lib/form').default;


describe('<Form />', () => {
  it('renders form', () => {
    const props = {
      alternativeAction: 'action',
      formError: 'Error',
    };
    const wrapper = mount(createElement(Form, props));

    assert.equal(wrapper.find('form .c-form').length, 1, 'form was rendered');
    assert.equal(wrapper.find('div .c-form-footer').length, 1, 'footer was rendered');
    assert.equal(wrapper.find('strong .c-form-error').length, 1, 'error was rendered');

    wrapper.unmount();
  });

  it('setPristine', () => {
    const wrapper = mount(createElement(Form));
    const instance = wrapper.instance();
    assert.isTrue(instance.state.isValid, 'default state is valild');

    instance.setValid(false);
    assert.isFalse(instance.state.isValid, 'state was changed');

    instance.setPristine();
    assert.isTrue(instance.state.isValid, 'state is back to default');

    wrapper.unmount();
  });

  it('setValid', () => {
    const wrapper = mount(createElement(Form));
    const instance = wrapper.instance();
    assert.isTrue(instance.state.isValid, 'default state is valild');

    instance.setValid(false);

    assert.isFalse(instance.state.isValid, 'state was changed');

    wrapper.unmount();
  });

  it('isDisabled', () => {
    const props = { locked: true };
    const wrapper = mount(createElement(Form, props));
    const instance = wrapper.instance();

    assert.isTrue(instance.isDisabled(), 'form is disabled if locked');

    wrapper.unmount();
  });

  it('reset', () => {
    const wrapper = mount(createElement(Form));
    const instance = wrapper.instance();
    assert.isTrue(instance.state.isValid, 'default state is valild');

    instance.setValid(false);
    assert.isFalse(instance.state.isValid, 'state was changed');

    instance.reset();
    assert.isTrue(instance.state.isValid, 'state is back to default');

    wrapper.unmount();
  });

  it('submit', () => {
    const preventDefault = fake();
    const wrapper = mount(createElement(Form));

    wrapper.find('form').simulate('submit', { preventDefault });

    assert.equal(preventDefault.callCount, 1, 'preventDefault was called');
    assert.isTrue(wrapper.instance().state.isValid, 'state is default');

    wrapper.unmount();
  });
});
