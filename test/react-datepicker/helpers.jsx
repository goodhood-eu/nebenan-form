const tryGetLast = (elements) => {
  if (elements.length <= 0) return null;
  return elements.last();
};

export const navigateToNextMonth = (wrapper) => {
  wrapper.find('.c-datepicker .c-datepicker-controls-next').last().simulate('click');
};

export const navigateToPreviousMonth = (wrapper) => {
  wrapper.find('.c-datepicker .c-datepicker-controls-previous').last().simulate('click');
};

export const findDatepicker = (wrapper) => tryGetLast(wrapper.find('.c-datepicker'));

export const findDate = (wrapper, dateText) => {
  const dates = wrapper.find('.c-datepicker .c-datepicker-date');
  const date = dates.filterWhere((dateElement) => dateElement.text() === String(dateText));
  return tryGetLast(date);
};
