const { createElement } = require('react');
const { assert } = require('chai');
const { mount } = require('enzyme');
const { spy, fake } = require('sinon');

const BaseInput = require('../../lib/input/base');

const ENTER_CHAR_CODE = 13;


class Child extends BaseInput {
  render() {
    return createElement('input', {
      ref: this.setEl('input'),
      type: 'text',
      value: this.state.value,
      onChange() {},
    });
  }
}

describe('BaseInput', () => {
  it('defaultValue', () => {
    const wrapper = mount(createElement(Child));
    assert.equal(wrapper.instance().state.value, '', 'default value is empty string');

    wrapper.unmount();
  });

  it('getValue', () => {
    const wrapper = mount(createElement(Child));
    assert.equal(wrapper.instance().getValue(), null, 'null on get if no value');

    wrapper.instance().setValue('   hello  ');
    assert.equal(wrapper.instance().getValue(), 'hello', 'trim value on get');

    const checkOnGet = (value) => {
      assert.equal(value, 'captain', 'pass value from state');
      return 'captain sparrow';
    };

    const props = { onGetValue: checkOnGet };
    const wrapperWithOnGet = mount(createElement(Child, props));
    wrapperWithOnGet.instance().setValue('captain');

    assert.equal(wrapperWithOnGet.instance().getValue(), 'captain sparrow', 'map value');

    wrapper.unmount();
    wrapperWithOnGet.unmount();
  });

  it('setValue', () => {
    const wrapper = mount(createElement(Child));
    wrapper.instance().setValue(null);
    assert.equal(wrapper.instance().state.value, '', 'set empty string if no value');

    wrapper.unmount();
  });

  it('getCaretPosition', () => {
    const wrapper = mount(createElement(Child));
    const input = wrapper.find('input');

    wrapper.instance().setValue('aaaaa');
    assert.equal(wrapper.instance().getCaretPosition(), 5, 'end of string by default');

    input.getDOMNode().setSelectionRange(0, 2);
    assert.equal(wrapper.instance().getCaretPosition(), 2, 'end of selection');

    wrapper.unmount();
  });

  it('readDomValue', () => {
    const spyMethod = spy(Child.prototype.readDomValue);
    Child.prototype.readDomValue = spyMethod;

    const wrapper = mount(createElement(Child));
    const input = wrapper.find('input');

    assert.equal(spyMethod.callCount, 1, 'call on mount');

    input.getDOMNode().value = 'captain';
    assert.equal(wrapper.instance().getValue(), null, 'state value is not changed');
    wrapper.instance().readDomValue();
    assert.equal(wrapper.instance().getValue(), 'captain', 'get value from dom');

    Child.prototype.readDomValue = BaseInput.prototype.readDomValue;
    wrapper.unmount();
  });

  it('setSelection', () => {
    const wrapper = mount(createElement(Child));
    const instance = wrapper.instance();
    instance.setValue('captain');
    instance.setSelection(1, 3);

    const input = wrapper.find('input').getDOMNode();
    assert.equal(input.selectionStart, 1, 'selection start is set');
    assert.equal(input.selectionEnd, 3, 'selection end is set');

    wrapper.unmount();
  });

  it('handleKeyDown', () => {
    const props = {
      onShiftEnterKey: fake(),
      onEnterKey: fake(),
      onKeyDown: fake(),
    };

    const wrapper = mount(createElement(Child, props));
    const instance = wrapper.instance();

    instance.handleKeyDown({});
    assert.isTrue(props.onKeyDown.calledOnce, 'support native event');

    instance.handleKeyDown({ keyCode: 0 });
    assert.isFalse(props.onEnterKey.calledOnce, 'ignore if enter not pressed');

    instance.handleKeyDown({ keyCode: ENTER_CHAR_CODE, ctrlKey: true });
    assert.isFalse(props.onEnterKey.calledOnce, 'ignore if ctrl is pressed');

    instance.handleKeyDown({ keyCode: ENTER_CHAR_CODE });
    assert.equal(props.onEnterKey.callCount, 1, 'fire on enter');

    instance.handleKeyDown({ keyCode: ENTER_CHAR_CODE, shiftKey: true });
    assert.equal(props.onShiftEnterKey.callCount, 1, 'fire on shift enter');
    assert.equal(props.onEnterKey.callCount, 1, 'do not fire on enter');

    wrapper.unmount();
  });

  it('updateValue', () => {
    const wrapper = mount(createElement(Child));
    const instance = wrapper.instance();

    const doneFake = fake();
    const updater = spy((value, caret) => {
      assert.equal(value, 'value', 'value from state is passed');
      assert.equal(caret, 5, 'caret from state');
      return { result: 'new value', position: 3 };
    });


    instance.setValue('value');
    instance.setSelection(5);
    instance.updateValue(updater, doneFake);

    assert.isTrue(updater.calledOnce, 'updater is called');
    assert.isTrue(doneFake.calledOnce, 'callback is called');
    assert.equal(instance.getValue(), 'new value', 'value is updated');

    wrapper.unmount();
  });
});
