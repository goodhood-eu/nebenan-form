import moment from 'moment';

export const getDateDiff = (now, date) => {
  const nowMoment = moment(now);
  const dateMoment = moment(date);

  if (Math.abs(dateMoment.diff(nowMoment, 'days')) > 7) return dateMoment.format('L');

  // To fix the case where user's time is behind the server time
  // we create a time that was a 'second ago', diff it and display that
  // in case we have a "date from the future"
  nowMoment.subtract(1, 'seconds');
  if (dateMoment.diff(nowMoment) < 0) return dateMoment.fromNow();

  return nowMoment.fromNow();
};
