const { createElement } = require('react');
const { assert } = require('chai');
const { mount, shallow } = require('enzyme');

const Select = require('../../lib/select').default;


describe('<Select />', () => {
  it('renders Select', () => {
    const props = {
      options: [
        { key: 'one', value: 'one' },
        { key: 'two', value: 'two' },
        { key: 'three', value: false },
      ],
    };
    const wrapper = mount(createElement(Select, props));

    assert.equal(wrapper.find('select').length, 1, 'Select was rendered');
    assert.equal(wrapper.find('option').length, 3, 'all options were rendered');

    assert.equal(wrapper.instance().state.value, 'one', 'value is one');
    assert.equal(wrapper.instance().state.index, 0, 'index is correct');

    wrapper.find('option').last().simulate('change');

    assert.isFalse(wrapper.instance().state.value, 'value was changed');
    assert.equal(wrapper.instance().state.index, 2, 'index was changed');

    wrapper.unmount();
  });
});


describe('Select', () => {
  it('defaultValue', () => {
    const props = {
      defaultValue: false,
      options: [
        { key: 'one', value: 'one' },
        { key: 'two', value: 'two' },
        { key: 'three', value: false },
      ],
    };
    const wrapper = shallow(createElement(Select, props));

    assert.isFalse(wrapper.instance().state.value, 'default value is set');
    assert.equal(wrapper.instance().state.index, 2, 'index is correct');
  });

  it('setValue', () => {
    const props = {
      defaultValue: false,
      options: [
        { key: 'one', value: 'one' },
        { key: 'two', value: 'two' },
        { key: 'three', value: false },
      ],
    };
    const wrapper = shallow(createElement(Select, props));

    wrapper.instance().setValue('two');
    assert.equal(wrapper.instance().state.value, 'two', 'value was set');
    assert.equal(wrapper.instance().state.index, 1, 'index is correct');
  });

  it('setPristine', () => {
    const props = {
      defaultValue: 'one',
      options: [
        { key: 'one', value: 'one' },
        { key: 'two', value: 'two' },
        { key: 'three', value: false },
        { key: 'four', value: 'five' },
      ],
    };
    const wrapper = shallow(createElement(Select, props));
    const instance = wrapper.instance();

    assert.equal(instance.getValue(), 'one', 'default value is correct');
    assert.equal(wrapper.instance().state.index, 0, 'index is correct');

    instance.setValue('five');

    assert.equal(instance.getValue(), 'five', 'value was updated');
    assert.equal(instance.state.index, 3, 'index was updated');
    assert.isFalse(instance.isPristine(), 'not pristine');

    instance.setPristine();

    assert.equal(instance.getValue(), 'five', 'value is same');
    assert.equal(instance.state.index, 3, 'index is the same');
    assert.isTrue(instance.isPristine(), 'pristine');
  });

  it('handleChange', () => {
    const props = {
      options: [
        { key: 'one', value: 'one' },
        { key: 'two', value: 'two' },
        { key: 'three', value: false },
        { key: 'four', value: 'five' },
      ],
    };
    const wrapper = shallow(createElement(Select, props));
    const instance = wrapper.instance();
    assert.equal(instance.state.value, 'one', 'default value is correct');
    assert.equal(instance.state.index, 0, 'index is correct');

    instance.handleChange({ target: { value: 3 } });

    assert.equal(instance.state.value, 'five', 'value was changed');
    assert.equal(instance.state.index, 3, 'index was changed');
  });
});
