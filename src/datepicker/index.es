import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import { bindTo } from '../utils';

import InputComponent from '../base';
import SimpleDatepicker from 'nebenan-react-datepicker/lib';
// import SimpleDatepicker from '../../../nebenan-react-datepicker/lib/';
import theme from './theme';

const getValue = v => v;


class Datepicker extends InputComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'handleGlobalClick',
      'hide',
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
    if (isOutside) this.hide();
  }

  activate() {
    if (this.isActive) return;

    this.isActive = true;
    this.setState({ isVisible: true });
  }

  deactivate() {
    if (!this.isActive) return;

    this.stopListeningToKeys();
    this.stopListeningToClicks();

    this.isActive = false;
  }

  show() {
    // if (this.picker.isVisible()) return;
    // this.picker.show();

    this.setState({ isVisible: true });
  }

  hide() {
    // if (!this.picker.isVisible()) return;
    // this.picker.hide();
    this.setState({ isVisible: false }, this.validate);
  }

  handleSelect(value) {
    // const value = this.picker.toString();
    this.setValue(value, this.validate);
    this.hide();
  }

  handleClick(event) {
    // TODO: solve this another way
    // console.log(this.els.picker && this.els.picker.contains(event.target), event.target, this.els.picker)
    if (this.els.picker && this.els.picker.contains(event.target)) return;
    console.log('click handled', event.target);
    this.activate();
    if (this.isVisible()) this.hide();
    else this.show();
  }

  isVisible() {
    return this.state.isVisible;
  }

  render() {
    const className = clsx('c-datepicker', this.props.className);
    const { label, placeholder, children, t } = this.props;
    const { value } = this.state;

    const localizedValue = getValue(t, value);
    const inputClassName = clsx('ui-input', { 'ui-input-error': this.isErrorActive() });

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    let picker;
    if (this.state.isVisible) {
      const { firstDay, weekdaysShortLabels, monthLabels } = this.props;

      picker = (

        <SimpleDatepicker
          rel={this.setEl('picker')}
          firstDay={firstDay}
          weekdayShortLabels={weekdaysShortLabels}
          monthLabels={monthLabels}
          theme={theme}
          onChange={this.handleSelect}
          selected={value}
        />
      );
    }


    return (
      <label ref={this.setEl('container')} className={className}>
        {labelNode}
        <div className="c-input-container">
          <input
            className={inputClassName}
            placeholder={placeholder} value={localizedValue} readOnly
            onClick={this.handleClick}
          />
          <input ref={this.setEl('input')} type="hidden" value={value || ''} />
          {picker}
          {children}
        </div>
        {error}
      </label>
    );
  }
}

Datepicker.propTypes = {
  ...InputComponent.propTypes,

  firstDay: PropTypes.number.isRequired,
  weekdaysShortLabels: PropTypes.arrayOf(PropTypes.string),
  monthLabels: PropTypes.arrayOf(PropTypes.string),
};

export default Datepicker;
