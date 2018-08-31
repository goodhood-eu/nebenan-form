const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');
const { fake } = require('sinon');

const Dropzone = require('../../lib/dropzone').default;


describe('<Dropzone />', () => {
  it('renders Dropzone', () => {
    const props = {
      labelDrag: 'labelDrag',
      labelRelease: 'labelRelease',
    };
    const wrapper = mount(createElement(Dropzone, props));
    assert.equal(wrapper.find('span .c-dropzone').length, 1, 'dropzone was rendered');
    assert.equal(wrapper.find('span .c-dropzone-overlay-text-active').length, 1, 'drag label was rendered');
    assert.equal(wrapper.find('span .c-dropzone-overlay-text-hover').length, 1, 'release label was rendered');

    wrapper.unmount();
  });

  it('should call activate when componentDidMount', () => {
    const props = {
      labelDrag: 'labelDrag',
      labelRelease: 'labelRelease',
    };
    const wrapper = mount(createElement(Dropzone, props));
    const instance = wrapper.instance();
    instance.activate = fake();

    wrapper.update();
    instance.componentDidMount();

    assert.equal(instance.activate.callCount, 1, 'activate was called');

    wrapper.unmount();
  });
});
