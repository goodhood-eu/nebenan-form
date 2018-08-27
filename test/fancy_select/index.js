const { createElement } = require('react');
const { assert } = require('chai');
const { mount, shallow } = require('enzyme');

const FancySelect = require('../../lib/fancy_select').default;


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
    assert.equal(wrapper.find('li .c-fancy_select-item').length, 2, 'two options were rendered');
    assert.equal(wrapper.instance().state.index, 0, 'index is 0');

    wrapper.find('li .c-fancy_select-item').last().simulate('click');

    assert.equal(wrapper.instance().state.value, 2, 'value was changed');
    assert.equal(wrapper.instance().state.index, 1, 'index was changed');
    assert.isTrue(
      wrapper.find('li .c-fancy_select-item').last().hasClass('is-active'),
      'active option has active class',
    );

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
    const wrapper = shallow(createElement(FancySelect, props));
    assert.equal(wrapper.instance().state.value, 555, 'default value is 555');
    assert.equal(wrapper.instance().state.index, 0, 'index is 0');
  });

  it('setValue', () => {
    const props = {
      defaultValue: 1,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 1 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 222 },
      ],
    };
    const wrapper = shallow(createElement(FancySelect, props));

    wrapper.instance().setValue(props.options[1].value);
    assert.equal(wrapper.instance().state.value, 222, 'set value');
    assert.equal(wrapper.instance().state.index, 1, 'index is 1');
  });

  it('setPristine', () => {
    const props = {
      defaultValue: 1,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 1 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    const wrapper = shallow(createElement(FancySelect, props));
    const instance = wrapper.instance();
    instance.setValue('value');

    assert.equal(instance.getValue(), 'value', 'value was updated');
    assert.equal(instance.state.index, -1, 'index is -1');
    assert.isFalse(instance.isPristine(), 'not pristine');

    instance.setPristine();

    assert.equal(instance.getValue(), 'value', 'value is same');
    assert.equal(instance.state.index, -1, 'index is the same');
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
    const wrapper = shallow(createElement(FancySelect, props));

    wrapper.instance().handleSelect(1);
    assert.equal(wrapper.instance().state.value, undefined, 'deselectable value is undefined');

    props.deselectable = false;
    wrapper.instance().handleSelect(1);
    assert.equal(wrapper.instance().state.value, 2, 'value is selectable and equal 2');
  });
});
