const { createElement } = require('react');
const { assert } = require('chai');
const { mount, shallow } = require('enzyme');
const { fake } = require('sinon');

const Form = require('../../lib/form').default;


describe('<Form />', () => {
  it.only('renders form', () => {
    const props = {
      alternativeAction: 'ffff',
      formError: 'Error',
    };
    const wrapper = mount(createElement(Form, props));

    assert.equal(wrapper.find('form .c-form').length, 1, 'form was rendered');
    assert.equal(wrapper.find('div .c-form-footer').length, 1, 'footer was rendered');
    assert.equal(wrapper.find('strong .c-form-error').length, 1, 'error2 was rendered');

    wrapper.unmount();
  });
});
