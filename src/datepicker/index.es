import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import keymanager from 'nebenan-helpers/lib/keymanager';
import eventproxy from 'nebenan-helpers/lib/eventproxy';

import Picker from './calendar';
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
    };
  }

  handleGlobalClick(event) {
    if (!this.isComponentMounted) return;
    const isOutside = !this.els.container.contains(event.target);
    if (isOutside) this.deactivate();
  }

  activate() {
    if (this.isVisible()) return;

    this.stopListeningToKeys = keymanager('esc', this.deactivate);
    this.stopListeningToClicks = eventproxy('click', this.handleGlobalClick);

    this.setState({ isVisible: true });
  }

  deactivate() {
    if (!this.isVisible()) return;

    this.stopListeningToKeys();
    this.stopListeningToClicks();

    this.setState({ isVisible: false }, this.validate);
  }

  handleSelect(value) {
    this.setValue(value, this.validate);
    this.deactivate();
  }

  handleClick() {
    if (!this.isVisible()) this.activate();
    else this.deactivate();
  }

  isVisible() {
    return this.state.isVisible;
  }

  render() {
    const className = clsx('c-datepicker', this.props.className);
    const { value } = this.state;
    const {
      label,
      placeholder,
      children,
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
          firstDay={firstDay}
          weekdayShortLabels={weekdayShortLabels}
          monthLabels={monthLabels}
          theme={theme}
          onChange={this.handleSelect}
          selected={value}
        />
      );
    }

    return (
      <div ref={this.setEl('container')}>
        <label className={className} onClick={this.handleClick}>
          {labelNode}
          <div className="c-input-container">
            <input
              className={inputClassName}
              placeholder={placeholder} value={localizedValue} readOnly
            />
            <input ref={this.setEl('input')} type="hidden" value={value || ''} />
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
  weekdayShortLabels: PropTypes.arrayOf(PropTypes.string),
  monthLabels: PropTypes.arrayOf(PropTypes.string),
  dateFormat: PropTypes.string.isRequired,
};

export default Datepicker;
