const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');

const Checkbox = require('../../lib/checkbox/').default;


describe('<Checkbox />', () => {
  it('renders checkbox input tag', () => {
    const wrapper = mount(createElement(Checkbox));
    assert.equal(wrapper.find('input[type="checkbox"]').length, 1, 'tag was rendered');

    wrapper.unmount();
  });
});
