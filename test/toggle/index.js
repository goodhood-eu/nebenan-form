const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');
const { fake } = require('sinon');

const Toogle = require('../../lib/toggle').default;


describe('<Toogle />', () => {
  it.skip('renders Toogle', () => {
    const props = { label: 'default label' };
    const wrapper = mount(createElement(Toogle, props));

    assert.equal(wrapper.find('input[type="checkbox"]').length, 1, 'input was rendered');
    assert.equal(wrapper.find('span .c-toggle-slide').length, 1, 'toggle slide was rendered');
    assert.equal(wrapper.find('strong .c-toggle-label').length, 1, 'toggle label was rendered');

    wrapper.unmount();
  });

  it('value changes', () => {
    const callback = fake();
    const wrapper = mount(createElement(Toogle));
    const instance = wrapper.instance();

    assert.isFalse(wrapper.instance().getValue(), 'value is false');

    const action = instance.actionChange(callback);

    action({ target: { checked: true } });

    assert.isTrue(instance.getValue(), 'value was changed');
    assert.equal(callback.callCount, 1, 'callback was called');

    wrapper.unmount();
  });
});
