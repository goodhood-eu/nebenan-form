const { createElement } = require('react');
const { assert } = require('chai');
const { shallow, mount } = require('enzyme');
const { fake } = require('sinon');

const BaseCheckbox = require('../../lib/input/base').default;

class Child extends BaseCheckbox {
  render() {
    return createElement('input', {
      ref: this.setEl('input'),
      type: 'checkbox',
      value: Boolean(this.state.value),
    });
  }
}

describe('BaseCheckbox', () => {
  it('getDefaultState', () => {
    const wrapper = mount(createElement(Child));
    assert.typeOf(wrapper.instance().state.value, 'boolean', 'default value type is boolean');

    wrapper.unmount();
  });

  it('setValue', () => {
    const wrapper = mount(createElement(Child));
    wrapper.instance().setValue(null);
    assert.equal(wrapper.instance().state.value, false, 'set false if no value');

    wrapper.unmount();
  });

  it('actionChange', () => {
    const callback = fake();
    const func = fake();
    const instance = shallow(createElement(Child)).instance();
    const action = instance.actionChange(callback);

    action({ target: { checked: 'true' } }, func);

    assert.equal(instance.state.value, 'true', 'checkbox was checked');
    assert.equal(callback.callCount, 1, 'callback was called');
  });
});
