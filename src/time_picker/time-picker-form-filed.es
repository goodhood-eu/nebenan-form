import React from 'react';
import cn from 'clsx';
import { TimePickerInput } from './time-picker-input';

export const TimePickerFormFiled = React.forwardRef(
  ({ className, label, error, onChange, value, name, required, disabled }, ref) => (

    <label className={cn(className, 'c-input', {
      'is-disabled': disabled,
    })}
    >
      {label && <strong className="ui-label">{label}</strong>}
      <div className="c-input-container">
        <TimePickerInput
          ref={ref}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          onChange={onChange}
          className={cn('ui-input', className, { 'ui-input-error': error })}
        />
      </div>
      {error && <em className="ui-error">{error}</em>}
    </label>
  ),
);
