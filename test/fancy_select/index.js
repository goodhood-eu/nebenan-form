const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');

const FancySelect = require('../../lib/fancy_select').default;

class Child extends FancySelect {
  render() {
    return createElement('input', {
      ref: this.setEl('input'),
      type: 'text',
      value: this.state.value,
    });
  }
}


describe('<FancySelect />', () => {
  it('renders FancySelect', () => {
    const props = {
      defaultValue: 1,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 1 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    const wrapper = mount(createElement(FancySelect, props));
    assert.equal(wrapper.find('ul .c-fancy_select-list').length, 1, 'FancySelect was rendered');

    wrapper.unmount();
  });
});

describe('FancySelect', () => {
  it('defaultValue', () => {
    const props = {
      defaultValue: 1,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 555 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    const wrapper = mount(createElement(Child, props));
    assert.equal(wrapper.instance().state.value, 555, 'default value is empty string');

    wrapper.unmount();
  });
});
