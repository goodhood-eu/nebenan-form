import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { isInt } from 'string-validate';
import { invoke } from '../utils';
import {
  cleanValue,
  formatValue,
  restoreCaret,
  increaseValue,
  decreaseValue,
  getCaretPosition,
} from './utils';


const DOWN = 40;
const UP = 38;

const TimeInput = (props, ref) => {
  const { onChange, onKeyDown, ...cleanProps } = props;

  const inputRef = useRef();
  useImperativeHandle(ref, () => inputRef.current);

  const changeValue = (value) => {
    const cleanedValue = cleanValue(value);

    if (!value) return invoke(onChange, value);
    if (!isInt(cleanedValue)) return;

    const { selectionEnd } = inputRef.current;
    const formattedValue = formatValue(cleanedValue);

    // Change value in DOM to restore caret position
    inputRef.current.value = formattedValue;
    restoreCaret(inputRef.current, getCaretPosition(selectionEnd, value, formattedValue));

    invoke(onChange, formattedValue);
  };

  const handleChange = (event) => changeValue(event.target.value);

  const handleKeyDown = (event) => {
    const { value, selectionEnd } = event.target;

    if (event.keyCode === UP) {
      event.preventDefault();
      changeValue(increaseValue(value, selectionEnd));
    }

    if (event.keyCode === DOWN) {
      event.preventDefault();
      changeValue(decreaseValue(value, selectionEnd));
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
};

const WrappedTimeInput = forwardRef(TimeInput);

WrappedTimeInput.propTypes = {
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default WrappedTimeInput;
