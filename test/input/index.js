const React = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');


const Input = require('../../lib/input').default;


describe('<Input />', () => {
  it('renders input tag', () => {
    const wrapper = mount(React.createElement(Input));
    assert.equal(wrapper.find('input[type="text"]').length, 1, 'tag was rendered');

    wrapper.unmount();
  });

  it('updates value on change', () => {
    const wrapper = mount(React.createElement(Input));
    const event = { target: { value: 'newValue' } };

    wrapper.find('input').simulate('change', event);

    assert.equal(wrapper.find('input').getDOMNode().value, 'newValue', 'dom was updated');
    assert.equal(wrapper.instance().getValue(), 'newValue', 'state was updated');

    wrapper.unmount();
  });

  it('validates on blur', (done) => {
    const props = {
      required: true,
      error: 'error message',
    };

    const wrapper = mount(React.createElement(Input, props));

    wrapper.find('input').simulate('blur');

    // Wait for state update
    process.nextTick(() => {
      if (wrapper.instance().getError() === 'error message') done();
      else done('Validation was not triggered');
      wrapper.unmount();
    });
  });

  it('clears error on focus', () => {
    const wrapper = mount(React.createElement(Input));

    wrapper.instance().setError('Error');
    assert.equal(wrapper.instance().getError(), 'Error', 'error is set');

    wrapper.find('input').simulate('focus');
    assert.equal(wrapper.instance().getError(), null, 'error was cleared');
  });
});
