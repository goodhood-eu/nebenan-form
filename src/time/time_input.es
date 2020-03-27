import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { invoke } from '../utils';
import { cleanValue, formatValue, isPositiveInteger, restoreCaret } from './utils';


const TimeInput = (props, ref) => {
  const { onChange, ...cleanProps } = props;

  const inputRef = useRef();
  useImperativeHandle(ref, () => inputRef.current);

  const handleChange = (event) => {
    const { value, selectionEnd } = event.target;
    const cleanedValue = cleanValue(value);

    if (!value) return invoke(onChange, event);
    if (!isPositiveInteger(cleanedValue)) return;

    event.target.value = formatValue(cleanedValue);

    if (event.target.value !== value) restoreCaret(inputRef.current, selectionEnd);
    invoke(onChange, event);
  };

  return (
    <input
      {...cleanProps}
      ref={inputRef}
      type="text"
      onChange={handleChange}
      maxLength={5}
    />
  );
};

TimeInput.propTypes = {
  onChange: PropTypes.func,
};

export default forwardRef(TimeInput);
