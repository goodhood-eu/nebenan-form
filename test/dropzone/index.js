const { createElement } = require('react');
const { assert } = require('chai');
const { mount, shallow } = require('enzyme');
const { fake } = require('sinon');

const Dropzone = require('../../lib/dropzone').default;


describe('<Dropzone />', () => {
  it('renders Dropzone', () => {
    const props = {
      labelDrag: 'labelDrag',
      labelRelease: 'labelRelease',
    };
    const wrapper = mount(createElement(Dropzone, props));
    assert.lengthOf(wrapper.find('span .c-dropzone'), 1, 'dropzone was rendered');
    assert.equal(wrapper.find('span .c-dropzone-overlay-text-active').length, 1, 'drag label was rendered');
    assert.equal(wrapper.find('span .c-dropzone-overlay-text-hover').length, 1, 'release label was rendered');

    // default state
    assert.isFalse(wrapper.instance().state.isActive, 'default state for isActive is correct');
    assert.isFalse(wrapper.instance().state.isHover, 'default state for isHover is correct');

    wrapper.unmount();
  });

  // componentDidMount
  it('should call activate', () => {
    const wrapper = shallow(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.activate = fake();

    wrapper.update();
    instance.componentDidMount();

    assert.equal(instance.activate.callCount, 1, 'activate was called');
  });

  // componentWillUnmount
  it('should call deactivate', () => {
    const wrapper = shallow(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.deactivate = fake();

    wrapper.update();
    instance.componentWillUnmount();

    assert.equal(instance.deactivate.callCount, 1, 'deactivate was called');
  });
});
