import React, { useImperativeHandle, forwardRef, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import PartInput from './part_input';


const TimeInput = (props, ref) => {
  const {
    className: passedClassName,
    value,
    onBlur,
    onFocus,
    onChange,
    ...rest
  } = props;

  const hoursInput = useRef();
  const minutesInput = useRef();

  useImperativeHandle(ref, () => hoursInput.current);

  const [hoursValue = '', minutesValue = ''] = value.split(':');

  const handleHoursChange = (newValue) => {
    onChange(`${newValue}:${minutesValue}`);
  };

  const handleMinutesChange = (newValue) => {
    onChange(`${hoursValue}:${newValue}`);
  };

  const focusHours = () => {
    hoursInput.current.focus();
    hoursInput.current.setSelectionRange(0, 0);
  };

  const focusMinutes = () => {
    minutesInput.current.focus();
    minutesInput.current.setSelectionRange(0, 0);
  };

  const className = clsx('c-time_input', passedClassName);
  const commonProps = { onBlur, onFocus };

  let divider;
  if (hoursValue || minutesValue) divider = ':';

  return (
    <div {...rest} className={className}>
      <PartInput
        {...commonProps}
        ref={hoursInput}
        value={hoursValue}
        min={0}
        max={24}
        onChange={handleHoursChange}
        onRight={focusMinutes}
      />
      {divider}
      <PartInput
        {...commonProps}
        ref={minutesInput}
        value={minutesValue}
        min={0}
        max={60}
        onChange={handleMinutesChange}
        onLeft={focusHours}
      />
    </div>
  );
};

TimeInput.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  value: PropTypes.string.isRequired,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
};

export default forwardRef(TimeInput);
