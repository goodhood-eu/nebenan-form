const { createElement } = require('react');
const { assert } = require('chai');
const { mount, shallow } = require('enzyme');

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
  let wrapper;

  it('defaultValue', () => {
    const props = {
      defaultValue: 1,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 555 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    wrapper = shallow(createElement(Child, props));
    assert.equal(wrapper.instance().state.value, 555, 'default value is 555');
  });

  it('setValue', () => {
    const props = {
      defaultValue: 1,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 1 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    wrapper = shallow(createElement(Child, props));

    wrapper.instance().setValue('value');
    assert.equal(wrapper.instance().state.value, 'value', 'set value');
  });

  it('setPristine', () => {
    const props = {
      defaultValue: 1,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 1 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    wrapper = shallow(createElement(Child, props));
    const instance = wrapper.instance();
    instance.setValue('value');

    assert.equal(instance.getValue(), 'value', 'value was updated');
    assert.isFalse(instance.isPristine(), 'not pristine');

    instance.setPristine();

    assert.equal(instance.getValue(), 'value', 'value is same');
    assert.isTrue(instance.isPristine(), 'pristine');
  });

  it('handleSelect', () => {
    const props = {
      defaultValue: 2,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 1 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
      deselectable: true,
    };
    wrapper = shallow(createElement(Child, props));

    wrapper.instance().handleSelect(1);
    assert.equal(wrapper.instance().state.value, undefined, 'deselectable value is undefined');

    props.deselectable = false;
    wrapper.instance().handleSelect(1);
    assert.equal(wrapper.instance().state.value, 2, 'value is selectable and equal 2');
  });
});
