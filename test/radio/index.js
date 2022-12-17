const { createElement } = require('react');
const { assert } = require('chai');
const { mount, shallow } = require('enzyme');
const { fake } = require('sinon');

const Radio = require('../../lib/radio');


describe('Radio', () => {
  it('renders Radio Buttons', () => {
    const props = {
      options: [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2222 },
      ],
    };
    const wrapper = mount(createElement(Radio, props));
    assert.equal(wrapper.find('input[type="radio"]').length, 2, '2 radio buttons were rendered');

    wrapper.unmount();
  });

  it('defaultValue', () => {
    const props = {
      options: [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
      ],
    };
    const wrapper = shallow(createElement(Radio, props));
    assert.equal(wrapper.instance().state.value, null, 'default value is null');
  });

  it('updates value on change', () => {
    const props = {
      options: [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
      ],
    };
    const callback = fake();
    const wrapper = shallow(createElement(Radio, props));
    const action = wrapper.instance().actionChange(callback);

    assert.equal(wrapper.instance().state.value, null, 'default value is null');

    action({ target: { value: props.options[1].value } });

    assert.equal(wrapper.instance().getValue(), 2, 'value was updated');
    assert.equal(callback.callCount, 1, 'callback was called');
  });
});
