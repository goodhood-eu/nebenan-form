import { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { addMonths } from 'date-fns';
import { getMonth, getMonthLabel } from './utils';
import MonthView from './month_view';

const Controls = ({ theme, label, onNext, onPrevious }) => (
  <div className={theme.controls}>
    <i onClick={onPrevious} className={theme.controlsPrevious} />
    <span className={theme.controlsLabel}>{label}</span>
    <i onClick={onNext} className={theme.controlsNext} />
  </div>
);

const DatePickerUnstyled = ({
  className: passedClassName,
  theme,

  firstDay,
  weekdayShortLabels,
  monthLabels,

  selected,
  onChange,
  minDate,
  maxDate,
}) => {
  const locale = { firstDay, weekdayShortLabels, monthLabels };
  const [month, setMonth] = useState(getMonth(selected || new Date()));

  const handleNextMonth = () => {
    setMonth(addMonths(month, 1));
  };

  const handlePreviousMonth = () => {
    setMonth(addMonths(month, -1));
  };

  const className = clsx(theme.root, passedClassName);
  const monthLabel = getMonthLabel(month, locale);

  const onCellClick = onChange;

  return (
    <article className={className}>
      <header>
        <Controls
          theme={theme}
          label={monthLabel}
          onNext={handleNextMonth}
          onPrevious={handlePreviousMonth}
        />
      </header>
      <MonthView
        {...{ locale, theme, month, minDate, maxDate, selected, onCellClick }}
      />
    </article>
  );
};

DatePickerUnstyled.propTypes = {
  className: PropTypes.string,

  theme: PropTypes.object.isRequired,

  firstDay: PropTypes.number.isRequired,
  weekdayShortLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  monthLabels: PropTypes.arrayOf(PropTypes.string).isRequired,

  selected: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  minDate: PropTypes.object,
  maxDate: PropTypes.object,
};

export default DatePickerUnstyled;
