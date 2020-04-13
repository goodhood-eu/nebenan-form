import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { isInt } from 'string-validate';
import { invoke } from '../utils';
import {
  isTimeFormat,
  formatValue,
  transformValue,
  getCaretPosition,
} from './utils';


const DOWN = 40;
const UP = 38;

const TimeInput = forwardRef((props, ref) => {
  const { onChange, onKeyDown, ...cleanProps } = props;

  const inputRef = useRef();
  useImperativeHandle(ref, () => inputRef.current);

  const changeValue = (value) => {
    const nextValue = isInt(value) ? formatValue(value) : value;

    if (!nextValue) return invoke(onChange, value);
    if (!isTimeFormat(nextValue)) return;

    const { selectionEnd, value: prevValue } = inputRef.current;

    // Change value in DOM to restore caret position
    inputRef.current.value = nextValue;
    const caretPosition = getCaretPosition(selectionEnd, prevValue, nextValue);
    inputRef.current.setSelectionRange(caretPosition, caretPosition);

    invoke(onChange, nextValue);
  };

  const handleChange = (event) => changeValue(event.target.value);

  const handleKeyDown = (event) => {
    const { value, selectionEnd } = event.target;

    if (event.keyCode === UP || event.keyCode === DOWN) {
      event.preventDefault();
      const colonIndex = value.indexOf(':');
      const changeMinutes = colonIndex >= 0 && selectionEnd > colonIndex;

      const diff = event.keyCode === UP ? 1 : -1;
      const newValue = transformValue(value, changeMinutes, diff);
      changeValue(newValue);
    }
  };

  return (
    <input
      {...cleanProps}
      ref={inputRef}
      type="text"
      maxLength={5}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    />
  );
});

TimeInput.propTypes = {
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default TimeInput;
