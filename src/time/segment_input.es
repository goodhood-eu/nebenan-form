import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { invoke } from '../utils';


const BACKSPACE = 8;
const DOWN = 40;
const UP = 38;
const RIGHT = 39;
const LEFT = 37;

const formatValue = (value) => value.toString().padStart(2, '0');

const SegmentInput = (props, ref) => {
  const {
    min,
    max,
    value,
    triggerRightValue,

    onChange,
    onRight,
    onLeft,
    ...cleanProps
  } = props;

  const handleChange = (event) => {
    const { selectionEnd, value: newValue } = event.target;
    const trimmedValue = selectionEnd === 1 ? newValue[0] : newValue.substring(newValue.length - 2);
    const intValue = parseInt(trimmedValue, 10);

    if (Number.isNaN(intValue) || intValue > max || intValue < min) return;

    onChange(formatValue(intValue));
    if (intValue > triggerRightValue) invoke(onRight);
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

SegmentInput.defaultProps = {
  triggerRightValue: 0,
};

SegmentInput.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  triggerRightValue: PropTypes.number.isRequired,

  onChange: PropTypes.func.isRequired,
  onRight: PropTypes.func,
  onLeft: PropTypes.func,
};

export default forwardRef(SegmentInput);
