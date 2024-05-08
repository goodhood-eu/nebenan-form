import { getDaysInMonth } from 'date-fns';

export const arrayOf = (number) => Array.from(new Array(number)).map((_, index) => index);
export const getMonth = (date) => new Date(date.getFullYear(), date.getMonth());

export const getMonthLabel = (date, locale) => {
  const { monthLabels } = locale;
  return `${monthLabels[date.getMonth()]} ${date.getFullYear()}`;
};

export const getMonthDetails = (date) => {
  const days = getDaysInMonth(date);
  const day = date.getDay();
  const offset = day === 0 ? 6 : day - 1;
  return { days, offset };
};
