import PropTypes from 'prop-types';
import { invoke, bindTo } from '../utils';
import { insertString, replaceString } from './utils';
import InputComponent from '../base';

import { ENTER_CHAR_CODE } from '../constants';


class TextInputComponent extends InputComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'focus',
      'blur',
      'handleKeyDown',
      'insertValue',
    );
  }

  componentDidMount() {
    super.componentDidMount();
    this.readDomValue();
  }

  getDefaultState(props) {
    const state = super.getDefaultState(props);
    if (!state.value) state.value = '';
    return state;
  }

  getValue() {
    const value = this.state.value.trim() || null;
    return this.props.onGetValue ? this.props.onGetValue(value) : value;
  }

  setValue(value, ...args) {
    super.setValue(value || '', ...args);
  }

  getCaretPosition() {
    return this.getInput().selectionEnd || this.state.value.length;
  }

  // Fixes the autofill feature in some of the dumbass browsers that are incapable of
  // triggering "change" event when they change values.
  readDomValue() {
    const { value } = this.getInput();
    if (value !== this.state.value) this.setValue(value, this.validate);
  }

  focus() {
    this.getInput().focus();
  }

  blur() {
    this.getInput().blur();
  }

  setSelection(start, end = start) {
    this.getInput().setSelectionRange(start, end);
  }

  handleKeyDown(event) {
    const { onShiftEnterKey, onEnterKey, onKeyDown } = this.props;

    if (event.keyCode === ENTER_CHAR_CODE && !event.ctrlKey) {
      if (event.shiftKey) invoke(onShiftEnterKey, event);
      else invoke(onEnterKey, event);
    }
    invoke(onKeyDown, event);
  }

  updateValue(updater, done) {
    // Raw value to deal with unicode
    const { value } = this.state;
    const caret = this.getCaretPosition();

    const { result, position } = updater(value, caret);
    const complete = () => {
      this.focus();
      this.setSelection(position);
      invoke(done);
    };

    this.setValue(result, complete);
    return result;
  }

  insertValue(text, done) {
    const updater = (value, caret) => insertString(value, text, caret);
    return this.updateValue(updater, done);
  }

  replaceValue(pattern, replacement, done) {
    const updater = (value, caret) => replaceString(value, pattern, replacement, caret);
    return this.updateValue(updater, done);
  }
}

TextInputComponent.propTypes = {
  ...InputComponent.propTypes,
  onShiftEnterKey: PropTypes.func,
  onEnterKey: PropTypes.func,
  onKeyDown: PropTypes.func,
  onGetValue: PropTypes.func,
};

export default TextInputComponent;
