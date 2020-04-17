import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { screenPosition, screenSize, size } from 'nebenan-helpers/lib/dom';
import keymanager from 'nebenan-helpers/lib/keymanager';
import eventproxy from 'nebenan-helpers/lib/eventproxy';

import Picker from 'nebenan-react-datepicker/lib';
import { bindTo } from '../utils';

import InputComponent from '../base';
import theme from './theme';
import { getValue } from './utils';

class Datepicker extends InputComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'handleGlobalClick',
      'deactivate',
      'handleSelect',
      'handleClick',
      'handleClear',
    );
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
    if (isOutside) this.deactivate();
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

  activate() {
    if (this.isVisible()) return;

    this.stopListeningToKeys = keymanager('esc', this.deactivate);
    this.stopListeningToClicks = eventproxy('click', this.handleGlobalClick);

    const updater = () => {
      const { isTop } = this.getPosition();
      return { isVisible: true, isTop };
    };

    this.setState(updater);
  }

  deactivate() {
    if (!this.isVisible()) return;

    this.stopListeningToKeys();
    this.stopListeningToClicks();

    this.setState({ isVisible: false, isTop: false }, this.validate);
  }

  handleSelect(value) {
    this.setValue(value, this.validate);
    this.deactivate();
  }

  handleClick() {
    if (!this.isVisible()) this.activate();
    else this.deactivate();
  }

  handleClear() {
    this.setValue(null);
  }

  isVisible() {
    return this.state.isVisible;
  }

  isClearable() {
    const { value } = this.state;
    return value !== null && value !== undefined;
  }

  render() {
    const className = clsx('c-datepicker', this.props.className);
    const { value, isTop } = this.state;
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
    } = this.props;

    const localizedValue = getValue(value, dateFormat);
    const inputClassName = clsx('ui-input', { 'ui-input-error': this.isErrorActive() });

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    let picker;
    if (this.isVisible()) {
      picker = (
        <Picker
          className={clsx({ 'is-top': isTop })}
          onChange={this.handleSelect}
          selected={value}
          {...{ theme, minDate, maxDate, monthLabels, weekdayShortLabels, firstDay }}
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
        <label onClick={this.handleClick}>
          {labelNode}
          <div className="c-datepicker-container">
            <input
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
