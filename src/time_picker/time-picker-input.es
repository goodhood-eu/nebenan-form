import React from 'react';
import propTypes from 'prop-types';
import TimeField from 'react-simple-timefield';

const style = { width: undefined }; // hack for reset react-simple-timefield style

export const TimePickerInput = React.forwardRef(
  ({ className, onChange, value, name, required, disabled }, ref) => (
    <TimeField
      ref={ref}
      value={value}
      name={name}
      required={required}
      disabled={disabled}
      className={className}
      onChange={onChange}
      style={style}
    />
  ),
);

TimePickerInput.propTypes = {
  className: propTypes.string,
  name: propTypes.string,
  value: propTypes.string,
  required: propTypes.bool,
  disabled: propTypes.bool,
  onChange: propTypes.func,
};
