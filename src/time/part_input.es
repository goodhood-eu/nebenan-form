import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { invoke } from '../utils';


const BACKSPACE = 8;
const DOWN = 40;
const UP = 38;
const RIGHT = 39;
const LEFT = 37;

const formatValue = (value) => value.toString().padStart(2, '0');

const PartInput = (props, ref) => {
  const {
    value,
    min,
    max,
    onBackspace,
    onChange,
    onRight,
    onLeft,
    ...cleanProps
  } = props;

  const handleChange = (event) => {
    let { value: newValue } = event.target;
    const { selectionEnd } = event.target;

    if (selectionEnd === 1) newValue = newValue[0];
    else newValue = newValue.substring(newValue.length - 2);

    const intValue = parseInt(newValue, 10);

    if (Number.isNaN(intValue)) return;
    if (intValue > max) return;
    if (intValue < min) return;

    onChange(formatValue(newValue));
    if (intValue > 2) invoke(onRight);
  };

  const handleKeyDown = (event) => {
    const intValue = parseInt(value, 10) || 0;

    switch (event.keyCode) {
      case BACKSPACE: {
        event.preventDefault();
        return onChange('');
      }
      case RIGHT: {
        event.preventDefault();
        return invoke(onRight);
      }
      case LEFT: {
        event.preventDefault();
        return invoke(onLeft);
      }
      case DOWN: {
        event.preventDefault();
        if (intValue < min + 1) return;
        return onChange(formatValue(intValue - 1));
      }
      case UP: {
        event.preventDefault();
        if (intValue > max - 1) return;
        return onChange(formatValue(intValue + 1));
      }
    }
  };

  return <input {...cleanProps} value={value} ref={ref} type="text" onKeyDown={handleKeyDown} onChange={handleChange} />;
};

PartInput.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,

  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBackspace: PropTypes.func,
  onRight: PropTypes.func,
  onLeft: PropTypes.func,
};

export default forwardRef(PartInput);
