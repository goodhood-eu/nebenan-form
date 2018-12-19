const { createElement } = require('react');
const { assert } = require('chai');
const { mount, shallow } = require('enzyme');

const FancySelect = require('../../lib/fancy_select').default;


describe('FancySelect', () => {
  it.skip('renders FancySelect', () => {
    const props = {
      defaultValue: 1,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 1 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    const wrapper = mount(createElement(FancySelect, props));
    const instance = wrapper.instance();

    assert.equal(wrapper.find('ul .c-fancy_select-list').length, 1, 'FancySelect was rendered');
    assert.equal(wrapper.find('li .c-fancy_select-item').length, 2, 'two options were rendered');
    assert.equal(instance.state.value, 1, 'value is set');
    assert.equal(instance.state.index, 0, 'index is set');

    wrapper.find('li .c-fancy_select-item').last().simulate('click');

    assert.equal(instance.state.value, 2, 'value was changed');
    assert.equal(instance.state.index, 1, 'index was changed');
    assert.isTrue(
      wrapper.find('li .c-fancy_select-item').last().hasClass('is-active'),
      'active option has active class',
    );

    wrapper.unmount();
  });

  it('defaultValue', () => {
    // default value is set
    const props = {
      defaultValue: 2,
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 1 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    const wrapper = shallow(createElement(FancySelect, props));
    const instance = wrapper.instance();

    assert.equal(instance.state.value, 2, 'default value is correct');
    assert.equal(instance.state.index, 1, 'index is correct');

    // default value is not set
    const props_2 = {
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 222 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    const instance_2 = shallow(createElement(FancySelect, props_2)).instance();
    assert.equal(instance_2.state.value, 222, 'default value is correct');
    assert.equal(instance_2.state.index, 0, 'index is correct');

    // default value is not from options
    const props_3 = {
      defaultValue: 'external',
      options: [
        { imageClass: 'c-sandbox-fancy_image_1', key: 'Eins', value: 333 },
        { imageClass: 'c-sandbox-fancy_image_2', key: 'Zwei', value: 2 },
      ],
    };
    const instance_3 = shallow(createElement(FancySelect, props_3)).instance();
    assert.equal(instance_3.state.value, 333, 'default value is correct');
    assert.equal(instance_3.state.index, 0, 'index is correct');
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
    const instance = wrapper.instance();

    assert.equal(instance.state.index, 0, 'index is correct');

    instance.setValue(props.options[1].value);

    assert.equal(instance.state.value, 222, 'value was changed');
    assert.equal(instance.state.index, 1, 'index was changed');
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

    assert.equal(instance.state.index, 0, 'index is correct');

    instance.setValue(2);

    assert.equal(instance.getValue(), 2, 'value was updated');
    assert.equal(instance.state.index, 1, 'index was updated');
    assert.isFalse(instance.isPristine(), 'not pristine');

    instance.setPristine();

    assert.equal(instance.getValue(), 2, 'value is same');
    assert.equal(instance.state.index, 1, 'index is the same');
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
    const instance = wrapper.instance();

    instance.handleSelect(1);
    assert.equal(instance.state.value, undefined, 'deselectable value is undefined');

    props.deselectable = false;
    instance.handleSelect(1);
    assert.equal(instance.state.value, 2, 'value is selectable and correct');
  });
});
