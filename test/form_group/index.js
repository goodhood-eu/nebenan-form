const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');


const FormGroup = require('../../lib/form_group');

describe('FormGroup', () => {
  it('should render the component', () => {
    const wrapper = mount(createElement(FormGroup));
    assert.equal(wrapper.find('.c-form_group').length, 1, 'FormGroup was rendered');

    wrapper.unmount();
  });

  it('should render the children', () => {
    const props = { children: ['one', 'two', 'three'] };
    const wrapper = mount(createElement(FormGroup, props));

    assert.equal(wrapper.find('.c-form_group-item').length, 3, 'all children were rendered');
    assert.isTrue(
      wrapper.find('.c-form_group').hasClass(`is-multiple is-size-${props.children.length}`),
    );

    wrapper.unmount();
  });
});
