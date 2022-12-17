const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');


const Input = require('../../lib/input');
const Form = require('../../lib/form');


describe('<Input />', () => {
  it('renders input tag', () => {
    const wrapper = mount(createElement(Input));
    assert.equal(wrapper.find('input[type="text"]').length, 1, 'tag was rendered');

    wrapper.unmount();
  });

  it('updates value on change', () => {
    const wrapper = mount(createElement(Input));
    const event = { target: { value: 'newValue' } };

    wrapper.find('input').simulate('change', event);

    assert.equal(wrapper.find('input').getDOMNode().value, 'newValue', 'dom was updated');
    assert.equal(wrapper.instance().getValue(), 'newValue', 'state was updated');

    wrapper.unmount();
  });

  it('validates on blur', (done) => {
    const props = {
      required: true,
      error: 'Error',
    };

    const wrapper = mount(createElement(Input, props));

    const check = () => {
      assert.equal(wrapper.instance().getError(), 'Error', 'validation was triggered');

      done();
      wrapper.unmount();
    };

    wrapper.find('input').simulate('blur');
    // Wait validation promises
    setTimeout(check, 300);
  });

  it('clears error on focus', () => {
    const wrapper = mount(createElement(Input));

    wrapper.instance().setError('Error');
    assert.equal(wrapper.instance().getError(), 'Error', 'error is set');

    wrapper.find('input').simulate('focus');
    assert.equal(wrapper.instance().getError(), null, 'error was cleared');

    wrapper.unmount();
  });

  it('disableAutoComplete', () => {
    const inputWithAutoComplete = mount(createElement(Input, {
      name: 'testName',
    }));

    const inputWithoutAutoComplete = mount(createElement(Input, {
      name: 'testName',
      disableAutoComplete: true,
    }));

    assert.equal(inputWithAutoComplete.find('input').prop('name'), 'testName', 'name is inserted in dom');

    assert.isUndefined(inputWithoutAutoComplete.find('input').prop('name'), 'name is not inserted in dom');
    assert.equal(inputWithoutAutoComplete.instance().getName(), 'testName', 'getName returns original name');
  });

  it('disableAutoComplete: input in form', () => {
    const input = createElement(Input, {
      name: 'testName',
      disableAutoComplete: true,
    });

    const form = createElement(Form, null, input);

    const wrapper = mount(form);
    const instance = wrapper.instance();

    wrapper.find(Input).instance().setValue('testValue');
    assert.include(instance.getModel(), { testName: 'testValue' });

    wrapper.unmount();
  });
});
