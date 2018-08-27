const { createElement } = require('react');
const { assert } = require('chai');
const { mount, shallow } = require('enzyme');
const { fake } = require('sinon');

const Radio = require('../../lib/radio').default;

describe('<Radio />', () => {
  let wrapper;

  it('renders Radio Buttons', () => {
    const props = {
      options: [
        { label: 'One', value: 1 },
        { label: 'Two', value: 2 },
      ],
    };
    wrapper = mount(createElement(Radio, props));
    assert.equal(wrapper.find('input[type="radio"]').length, 2, '2 radio buttons were rendered');

    wrapper.unmount();
  });

  describe('Radio', () => {
    it('defaultValue', () => {
      const props = {
        options: [
          { label: 'One', value: 1 },
          { label: 'Two', value: 2 },
        ],
      };
      wrapper = shallow(createElement(Radio, props));
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
      wrapper = shallow(createElement(Radio, props));
      const action = wrapper.instance().actionChange(callback);

      action({ target: { value: props.options[1].value } });

      assert.equal(wrapper.instance().getValue(), 2, 'state was updated');
      assert.equal(callback.callCount, 1, 'callback was called');
    });
  });
});
