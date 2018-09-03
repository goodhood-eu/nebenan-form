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

    instance.componentDidMount();
    assert.equal(instance.activate.callCount, 1, 'activate was called');
  });

  // componentWillUnmount
  it('should call deactivate', () => {
    const wrapper = shallow(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.deactivate = fake();

    instance.componentWillUnmount();
    assert.equal(instance.deactivate.callCount, 1, 'deactivate was called');
  });

  it('reset', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();

    instance.reset();
    assert.deepEqual(instance.state, instance.getDefaultState(), 'state is back to default');

    wrapper.unmount();
  });

  it('activate', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.handleDragStart = fake();
    instance.handleDragEnd = fake();
    instance.handleGlobalDrop = fake();

    const map = {};
    document.addEventListener = fake((event, cb) => {
      map[event] = cb;
    });

    instance.activate();
    map.dragenter();
    map.dragleave();
    map.drop();

    assert.equal(instance.handleDragStart.callCount, 1, 'handleDragStart was called');
    assert.equal(instance.handleDragEnd.callCount, 1, 'handleDragEnd was called');
    assert.equal(instance.handleGlobalDrop.callCount, 1, 'handleGlobalDrop was called');

    wrapper.unmount();
  });

  it('deactivate', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.handleDragStart = fake();
    instance.handleDragEnd = fake();
    instance.handleGlobalDrop = fake();

    const map = {};
    document.removeEventListener = fake((event, cb) => {
      map[event] = cb;
    });

    instance.deactivate();
    map.dragenter();
    map.dragleave();
    map.drop();

    assert.equal(instance.handleDragStart.callCount, 1, 'handleDragStart was called');
    assert.equal(instance.handleDragEnd.callCount, 1, 'handleDragEnd was called');
    assert.equal(instance.handleGlobalDrop.callCount, 1, 'handleGlobalDrop was called');

    wrapper.unmount();
  });

  it('handleDragStart', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();

    instance.handleDragStart();
    assert.isTrue(instance.state.isActive, 'state was changed');

    wrapper.unmount();
  });

  it('handleDragEnd', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();

    instance.handleDragStart();
    instance.handleDragEnd();
    assert.isFalse(instance.state.isActive, 'state was changed');

    wrapper.unmount();
  });

  it('handleGlobalDrop', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();

    instance.handleDragStart();
    instance.handleGlobalDrop();
    assert.isFalse(instance.state.isActive, 'state was changed');

    wrapper.unmount();
  });

  it('handleDragEnter', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();

    instance.handleDragEnter();
    assert.isTrue(instance.state.isHover, 'state was changed');

    wrapper.unmount();
  });

  it('handleDragLeave', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();

    instance.handleDragEnter();
    instance.handleDragLeave();
    assert.isFalse(instance.state.isHover, 'state was changed');

    wrapper.unmount();
  });

  it('handleDragOver', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();
    const preventDefault = fake();
    const stopPropagation = fake();

    instance.handleDragOver({ preventDefault, stopPropagation });
    assert.equal(preventDefault.callCount, 1, 'preventDefault was called');
    assert.equal(stopPropagation.callCount, 1, 'stopPropagation was called');

    wrapper.unmount();
  });

  it('handleDrop', () => {
    const wrapper = mount(createElement(Dropzone));
    const instance = wrapper.instance();
    const preventDefault = fake();

    instance.handleDrop({ preventDefault, dataTransfer: { files: ['file1', 'file2'] } });
    assert.equal(preventDefault.callCount, 1, 'preventDefault was called');

    wrapper.unmount();
  });
});
