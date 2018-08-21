const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');
const { fake } = require('sinon');

const CheckboxInputComponent = require('../../lib/checkbox/base').default;

class Child extends CheckboxInputComponent {
  render() {
    return createElement('input', {
      ref: this.setEl('input'),
      type: 'checkbox',
      value: this.state.value,
    });
  }
}

describe('CheckboxInputComponent', () => {
  it('defaultValue', () => {
    const props = { defaultChecked: true };
    const wrapper = mount(createElement(Child, props));
    assert.isTrue(wrapper.instance().state.value, 'default value is set');

    wrapper.unmount();
  });

  it('setValue', () => {
    const wrapper = mount(createElement(Child));
    wrapper.instance().setValue(null);
    assert.isFalse(wrapper.instance().state.value, 'set false if no value');

    wrapper.unmount();
  });

  it('actionChange', () => {
    const callback = fake();
    const wrapper = mount(createElement(Child));
    const instance = wrapper.instance();

    const action = instance.actionChange(callback);

    action({ target: { checked: true } });

    assert.isTrue(instance.getValue(), 'value was changed');
    assert.equal(callback.callCount, 1, 'callback was called');

    wrapper.unmount();
  });
});
