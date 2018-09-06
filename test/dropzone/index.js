const { createElement } = require('react');
const { assert } = require('chai');
const { shallow } = require('enzyme');
const { fake } = require('sinon');

const Dropzone = require('../../lib/dropzone').default;


describe('<Dropzone />', () => {
  it('renders Dropzone', () => {
    const props = {
      labelDrag: 'labelDrag',
      labelRelease: 'labelRelease',
    };
    const wrapper = shallow(createElement(Dropzone, props));
    const instance = wrapper.instance();
    const labelDrag = wrapper.find('span .c-dropzone-overlay-text-active');
    const labelRelease = wrapper.find('span .c-dropzone-overlay-text-hover');

    assert.lengthOf(wrapper.find('span .c-dropzone'), 1, 'dropzone was rendered');
    assert.lengthOf(labelDrag, 1, 'drag label was rendered');
    assert.lengthOf(labelRelease, 1, 'release label was rendered');

    assert.equal(labelDrag.text(), 'labelDrag', 'drag label text was rendered');
    assert.equal(labelRelease.text(), 'labelRelease', 'release label was rendered');

    // default state
    assert.isFalse(instance.state.isActive, 'default state for isActive is correct');
    assert.isFalse(instance.state.isHover, 'default state for isHover is correct');
  });

  // componentDidMount
  it('activate on mount', () => {
    const wrapper = shallow(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.activate = fake();

    instance.componentDidMount();
    assert.isTrue(instance.activate.calledOnce, 'activate was called');
  });

  // componentWillUnmount
  it('deactivate on unmount', () => {
    const wrapper = shallow(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.deactivate = fake();

    instance.componentWillUnmount();
    assert.isTrue(instance.deactivate.calledOnce, 'deactivate was called');
  });

  it('reset', () => {
    const wrapper = shallow(createElement(Dropzone));
    const instance = wrapper.instance();

    instance.handleDragStart();
    instance.handleDragEnter();
    assert.isTrue(instance.state.isActive, 'state was changed');
    assert.isTrue(instance.state.isHover, 'state was changed');

    instance.reset();
    assert.deepEqual(instance.state, instance.getDefaultState(), 'state is back to default');
  });

  it('activate', () => {
    const wrapper = shallow(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.handleDragStart = fake();
    instance.handleDragEnd = fake();
    instance.handleGlobalDrop = fake();
    const originalListener = document.addEventListener;

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

    document.removeEventListener = originalListener;
  });

  it('deactivate', () => {
    const wrapper = shallow(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.handleDragStart = fake();
    instance.handleDragEnd = fake();
    instance.handleGlobalDrop = fake();
    const originalListener = document.removeEventListener;

    const map = {};
    document.removeEventListener = fake((event, cb) => {
      map[event] = cb;
    });

    instance.deactivate();
    map.dragenter();
    map.dragleave();
    map.drop();

    assert.isTrue(instance.handleDragStart.calledOnce, 'handleDragStart was called');
    assert.isTrue(instance.handleDragEnd.calledOnce, 'handleDragEnd was called');
    assert.isTrue(instance.handleGlobalDrop.calledOnce, 'handleGlobalDrop was called');

    document.removeEventListener = originalListener;
  });

  it('handleDragStart', () => {
    const props = { onDragStart: fake() };
    const wrapper = shallow(createElement(Dropzone, props));
    const instance = wrapper.instance();

    instance.handleDragStart();
    instance.handleDragStart();
    instance.handleDragStart();

    assert.isTrue(instance.state.isActive, 'state was changed');
    assert.isTrue(props.onDragStart.calledOnce, 'onDragStart was called only once');
  });

  it('handleDragEnd', () => {
    const props = { onDragEnd: fake() };
    const wrapper = shallow(createElement(Dropzone, props));
    const instance = wrapper.instance();

    instance.handleDragStart();
    instance.handleDragStart();
    instance.handleDragEnd();
    assert.isTrue(instance.state.isActive, 'state was not changed');
    assert.isFalse(props.onDragEnd.calledOnce, 'onDragEnd was not called');

    instance.handleGlobalDrop();

    instance.handleDragStart();
    instance.handleDragEnd();
    assert.isFalse(instance.state.isActive, 'state was changed');
    assert.isTrue(props.onDragEnd.calledOnce, 'onDragEnd was called');
  });

  it('handleGlobalDrop', () => {
    const wrapper = shallow(createElement(Dropzone));
    const instance = wrapper.instance();
    instance.reset = fake();

    instance.handleGlobalDrop();
    assert.isTrue(instance.reset.calledOnce, 'reset was called');
  });

  it('handleDragEnter', () => {
    const props = { onDragEnter: fake() };
    const wrapper = shallow(createElement(Dropzone, props));
    const instance = wrapper.instance();

    instance.handleDragEnter();
    instance.handleDragEnter();
    instance.handleDragEnter();

    assert.isTrue(instance.state.isHover, 'state was changed');
    assert.isTrue(props.onDragEnter.calledOnce, 'onDragEnter was called only once');
  });

  it('handleDragLeave', () => {
    const props = { onDragLeave: fake() };
    const wrapper = shallow(createElement(Dropzone, props));
    const instance = wrapper.instance();

    instance.handleDragEnter();
    instance.handleDragEnter();
    instance.handleDragEnter();
    instance.handleDragLeave();
    assert.isTrue(instance.state.isHover, 'state was not changed');
    assert.isFalse(props.onDragLeave.calledOnce, 'onDragLeave was not called');

    instance.handleGlobalDrop();

    instance.handleDragEnter();
    instance.handleDragLeave();
    assert.isFalse(instance.state.isHover, 'state was changed');
    assert.isTrue(props.onDragLeave.calledOnce, 'onDragLeave was called');
  });

  it('handleDragOver', () => {
    const props = { onDragOver: fake() };
    const wrapper = shallow(createElement(Dropzone, props));
    const instance = wrapper.instance();
    const preventDefault = fake();
    const stopPropagation = fake();

    instance.handleDragOver({ preventDefault, stopPropagation });
    assert.isTrue(preventDefault.calledOnce, 'preventDefault was called');
    assert.isTrue(stopPropagation.calledOnce, 'stopPropagation was called');
    assert.isTrue(props.onDragOver.calledOnce, 'onDragOver was called');
  });

  it('handleDrop', () => {
    const props = { onSelect: fake(), onDrop: fake() };
    const preventDefault = fake();

    // without files
    const wrapper = shallow(createElement(Dropzone, props));
    const instance = wrapper.instance();

    instance.handleDrop({ preventDefault, dataTransfer: { files: [] } });

    assert.isTrue(preventDefault.calledOnce, 'preventDefault was called');
    assert.isFalse(props.onSelect.calledOnce, 'onSelect was not called');
    assert.isTrue(props.onDrop.calledOnce, 'onDrop was called');

    // with files
    const wrapperWithoutFiles = shallow(createElement(Dropzone, props));
    const instanceWithoutFiles = wrapperWithoutFiles.instance();

    instanceWithoutFiles.handleDrop({ preventDefault, dataTransfer: { files: ['file1', 'file2'] } });
    assert.isTrue(props.onSelect.calledOnce, 'onSelect was called');
    assert.isFalse(props.onDrop.calledOnce, 'onDrop was not called');
  });
});
