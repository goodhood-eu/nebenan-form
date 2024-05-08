import clsx from 'clsx';
import { addMonths, isSameDay, setDate, startOfDay } from 'date-fns';
import { arrayOf, getMonthDetails } from './utils';

const DAYS_COUNT = 7;

const renderLabelsRow = (locale, theme) => {
  const { firstDay, weekdayShortLabels } = locale;
  const labels = arrayOf(DAYS_COUNT).map((i) => {
    const key = i + firstDay > 6 ? 0 : i + firstDay;
    const className = clsx(theme.weekdayLabel, {
      [theme.isWeekend]: key === 6 || key === 0,
    });
    return <th key={key} className={className}>{weekdayShortLabels[key]}</th>;
  });
  return <tr>{labels}</tr>;
};

const renderMonth = ({
  theme,
  month,
  minDate: providedMinDate,
  maxDate,
  selected,
  onCellClick,
}) => {
  const { days, offset } = getMonthDetails(month);

  const weeks = Math.ceil((days + offset) / DAYS_COUNT);
  const today = new Date();

  const minDate = providedMinDate && startOfDay(providedMinDate);

  const renderWeek = (week) => {
    const shift = week * DAYS_COUNT;
    const isFirstWeek = week === 0;

    const items = arrayOf(DAYS_COUNT).map((day) => {
      const date = shift + day + 1 - offset;

      const isStartFiller = isFirstWeek && day < offset;
      const isEndFiller = date > days;

      let monthOffset = 0;
      if (isStartFiller) monthOffset = -1;
      else if (isEndFiller) monthOffset = 1;

      const dateObj = setDate(addMonths(month, monthOffset), date);

      const isBeforeMinDate = minDate ? dateObj < minDate : false;
      const isAfterMaxDate = maxDate ? dateObj > maxDate : false;

      const isDisabled = isBeforeMinDate || isAfterMaxDate;

      const className = clsx(theme.cell, {
        [theme.isToday]: isSameDay(today, dateObj),
        [theme.isSelected]: selected && isSameDay(selected, dateObj),
        [theme.isDisabled]: isDisabled,
        [theme.isInteractive]: !isDisabled && !isStartFiller && !isEndFiller,
      });

      let label;
      if (!isStartFiller && !isEndFiller) {
        let handleClick;
        if (onCellClick && !isDisabled) {
          handleClick = onCellClick.bind(null, dateObj);
        }
        label = <span className={theme.date} onClick={handleClick}>{date}</span>;
      }

      return <td key={date} className={className}>{label}</td>;
    });

    return <tr key={week}>{items}</tr>;
  };

  return arrayOf(weeks).map(renderWeek);
};

const MonthView = ({ theme, locale, month, minDate, maxDate, selected, onCellClick }) => {
  const rows = renderMonth({ theme, month, minDate, maxDate, selected, onCellClick });
  return (
    <table className={theme.table} cellSpacing="0">
      <thead>{renderLabelsRow(locale, theme)}</thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default MonthView;
