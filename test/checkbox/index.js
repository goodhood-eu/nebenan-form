const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');

const Checkbox = require('../../lib/checkbox/').default;


describe('<Checkbox />', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(createElement(Checkbox));
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('renders checkbox input tag', () => {
    assert.equal(wrapper.find('input[type="checkbox"]').length, 1, 'tag was rendered');
  });

  it('updates value on change', () => {
    const event = { target: { checked: true } };

    wrapper.find('input').simulate('change', event);

    assert.isTrue(wrapper.find('input').getDOMNode().checked, 'dom was updated');
    assert.isTrue(wrapper.instance().getValue(), 'state was updated');
  });
});
