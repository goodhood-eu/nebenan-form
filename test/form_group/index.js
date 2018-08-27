const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');


const FormGroup = require('../../lib/form_group').default;

describe('<FormGroup />', () => {
  let wrapper;

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render the component', () => {
    wrapper = mount(createElement(FormGroup));
    assert.isTrue(wrapper.find('div').hasClass('c-form_group'));
  });

  it('should render the children', () => {
    const props = { children: ['one', 'two', 'three'] };
    wrapper = mount(createElement(FormGroup, props));
    assert.equal(wrapper.find('div .c-form_group-item').length, 3, 'children were rendered');
  });
});
