const { createElement } = require('react');
const { assert } = require('chai');
const { shallow } = require('enzyme');
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
  let wrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('defaultValue', () => {
    const props = { defaultChecked: true };
    wrapper = shallow(createElement(Child, props));
    assert.isTrue(wrapper.instance().state.value, 'default value is set');
  });

  it('setValue', () => {
    wrapper = shallow(createElement(Child));
    wrapper.instance().setValue(null);
    assert.isFalse(wrapper.instance().state.value, 'set false if no value');
  });

  it('actionChange', () => {
    const callback = fake();
    wrapper = shallow(createElement(Child));
    const instance = wrapper.instance();

    const action = instance.actionChange(callback);

    action({ target: { checked: true } });

    console.log('######', wrapper.debug());
    assert.isTrue(instance.getValue(), 'value was changed');
    assert.equal(callback.callCount, 1, 'callback was called');
  });
});
