const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');

const locale = require('./locale');
const Datepicker = require('../../lib/datepicker');

describe('Datepicker', () => {
  it('renders Datepicker', () => {
    const props = {
      ...locale,
    };
    const wrapper = mount(createElement(Datepicker, props));

    assert.equal(wrapper.find('.c-datepicker').length, 1, 'Datepicker was rendered');
  });

  it('shows picker popover on click', () => {
    const props = {
      ...locale,
    };
    const wrapper = mount(createElement(Datepicker, props));

    wrapper.find('.c-datepicker .ui-input').last().simulate('click');

    assert.equal(wrapper.find('.c-picker').length, 1, 'Picker was rendered');

    wrapper.find('.c-datepicker .ui-input').last().simulate('click');

    assert.equal(wrapper.find('.c-picker').length, 0, 'Picker was hidden');
  });

  it('clears value', () => {
    const props = {
      ...locale,
    };
    const wrapper = mount(createElement(Datepicker, props));
    const instance = wrapper.instance();

    instance.setValue('2019-01-01');
    wrapper.update();

    assert.equal(wrapper.find('.c-datepicker .c-datepicker-icon').length, 1, 'Clear button was rendered');

    wrapper.find('.c-datepicker .c-datepicker-icon').last().simulate('click');

    assert.equal(instance.state.value, null, 'value was cleared');
  });

  it('takes selected values from picker', () => {
    const props = {
      ...locale,
    };
    const wrapper = mount(createElement(Datepicker, props));
    const instance = wrapper.instance();

    wrapper.find('.c-datepicker .ui-input').last().simulate('click');

    instance.handleSelect('2020-01-05');
    wrapper.update();

    assert.equal(wrapper.find('.c-picker').length, 0, 'Picker was hidden');
    assert.equal(instance.state.value, '2020-01-05', 'value is the selected one');
  });
});
