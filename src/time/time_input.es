import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import SegmentInput from './segment_input';


const focusInputAtStart = (input) => {
  input.focus();
  input.setSelectionRange(0, 0);
};

const TimeInput = (props, ref) => {
  const {
    value,
    onBlur,
    onFocus,
    onChange,
    ...rest
  } = props;

  const hoursInput = useRef();
  const minutesInput = useRef();
  useImperativeHandle(ref, () => ({
    focus() {
      hoursInput.current.focus();
    },

    blur() {
      hoursInput.current.blur();
      minutesInput.current.blur();
    },
  }));

  const [hoursValue = '', minutesValue = ''] = value.split(':');

  const handleHoursChange = (newValue) => onChange(`${newValue}:${minutesValue}`);
  const handleMinutesChange = (newValue) => onChange(`${hoursValue}:${newValue}`);

  const focusHours = () => focusInputAtStart(hoursInput.current);
  const focusMinutes = () => focusInputAtStart(minutesInput.current);

  const className = clsx('c-time-time_input', props.className);
  const commonProps = { onBlur, onFocus };

  return (
    <div {...rest} className={className}>
      <SegmentInput
        {...commonProps}
        ref={hoursInput}
        value={hoursValue}
        min={0}
        max={24}
        triggerRightValue={2}
        placeholder="--"
        onChange={handleHoursChange}
        onRight={focusMinutes}
      />
      <em>:</em>
      <SegmentInput
        {...commonProps}
        ref={minutesInput}
        value={minutesValue}
        min={0}
        max={60}
        placeholder="--"
        onChange={handleMinutesChange}
        onLeft={focusHours}
      />
    </div>
  );
};

TimeInput.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string.isRequired,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
};

export default forwardRef(TimeInput);
