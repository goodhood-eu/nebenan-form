import PropTypes from 'prop-types';
import clsx from 'clsx';
import memorize from 'lodash/memoize';

import { screenPosition, screenSize, size } from 'nebenan-helpers/lib/dom';
import keymanager from 'nebenan-helpers/lib/keymanager';
import eventproxy from 'nebenan-helpers/lib/eventproxy';

import Picker from 'nebenan-react-datepicker/lib';
import { bindTo } from '../utils';

import InputComponent from '../base';
import baseCalendarTheme from './calendar_theme';
import { getCalendarTheme, getDate, getValueFromDate, getValueFromISO } from './utils';

class Datepicker extends InputComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'handleGlobalClick',
      'hide',
      'handleSelect',
      'handleClick',
      'handleClear',
    );
    this.getCalendarTheme = memorize(getCalendarTheme.bind(null, baseCalendarTheme));
  }

  componentWillUnmount() {
    this.deactivate();
    super.componentWillUnmount();
  }

  getDefaultState(props) {
    return {
      ...super.getDefaultState(props),
      isVisible: false,
      isTop: false,
    };
  }

  handleGlobalClick(event) {
    if (!this.isComponentMounted) return;
    const isOutside = !this.els.container.contains(event.target);
    if (isOutside) this.hide();
  }

  getPosition() {
    const { container } = this.els;

    const { top } = screenPosition(container);
    const { height } = size(container);
    const { height: screenHeight } = screenSize(global);

    const availableSpace = screenHeight - top;
    const neededSpace = height * 2;
    const isTop = neededSpace > availableSpace;

    return { isTop };
  }

  show() {
    const { isTop } = this.getPosition();

    this.activate();
    this.setState({ isVisible: true, isTop });
  }

  hide() {
    this.deactivate();
    this.setState({ isVisible: false, isTop: false }, this.validate);
  }

  activate() {
    if (this.isActive) return;

    this.stopListeningToKeys = keymanager('esc', this.hide);
    this.stopListeningToClicks = eventproxy('click', this.handleGlobalClick);

    this.isActive = true;
  }

  deactivate() {
    if (!this.isActive) return;

    this.stopListeningToKeys();
    this.stopListeningToClicks();

    this.isActive = false;
  }

  handleSelect(date) {
    this.setValue(getValueFromDate(date), this.hide);
  }

  handleClick() {
    if (!this.isActive) this.show();
    else this.hide();
  }

  handleClear(event) {
    event.preventDefault();
    this.setValue(null, this.validate);
  }

  isClearable() {
    const { value } = this.state;
    return Boolean(value);
  }

  render() {
    const className = clsx('c-datepicker', this.props.className);
    const { value, isTop, isVisible } = this.state;
    const {
      label,
      placeholder,
      children,
      minDate,
      maxDate,
      dateFormat,
      firstDay,
      weekdayShortLabels,
      monthLabels,
      theme: passedTheme,
    } = this.props;

    const localizedValue = getValueFromISO(value, dateFormat);
    const inputClassName = clsx('ui-input', { 'ui-input-error': this.isErrorActive() });

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    let picker;
    if (isVisible) {
      picker = (
        <Picker
          className={clsx({ 'is-top': isTop })}
          onChange={this.handleSelect}
          selected={getDate(value)}
          minDate={getDate(minDate)}
          maxDate={getDate(maxDate)}
          theme={this.getCalendarTheme(passedTheme)}
          {...{ monthLabels, weekdayShortLabels, firstDay }}
        />
      );
    }

    let clearButton;
    if (this.isClearable()) {
      clearButton = (
        <i className="c-datepicker-clear icon-cross" onClick={this.handleClear} />
      );
    }

    return (
      <div ref={this.setEl('container')} className={className}>
        <label>
          {labelNode}
          <div className="c-datepicker-container">
            <input
              onClick={this.handleClick}
              ref={this.setEl('input')}
              className={inputClassName}
              placeholder={placeholder}
              value={localizedValue}
              readOnly
            />
            {clearButton}
            {children}
          </div>
          {error}
        </label>
        {picker}
      </div>
    );
  }
}

Datepicker.propTypes = {
  ...InputComponent.propTypes,

  theme: PropTypes.object,

  firstDay: PropTypes.number.isRequired,
  weekdayShortLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  monthLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
  dateFormat: PropTypes.string.isRequired,

  minDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  maxDate: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default Datepicker;
