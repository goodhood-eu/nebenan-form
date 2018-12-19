const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');


const FormGroup = require('../../lib/form_group').default;

describe('FormGroup', () => {
  it.skip('should render the component', () => {
    const wrapper = mount(createElement(FormGroup));
    assert.isTrue(wrapper.find('div').hasClass('c-form_group'));

    wrapper.unmount();
  });

  it.skip('should render the children', () => {
    const props = { children: ['one', 'two', 'three'] };
    const wrapper = mount(createElement(FormGroup, props));

    assert.equal(wrapper.find('div .c-form_group-item').length, 3, 'all children were rendered');
    assert.isTrue(
      wrapper.find('div .c-form_group').hasClass(`is-multiple is-size-${props.children.length}`),
    );

    wrapper.unmount();
  });
});
