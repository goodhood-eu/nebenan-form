import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import throttle from 'lodash/throttle';
import classNames from 'classnames';
import { invoke, bindTo } from '../utils';

import InputComponent from '../base';

import { CHECKBOX_CHANGE_RATE } from '../constants';


class Radio extends InputComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'renderRadio',
    );
  }

  getDefaultState(props) {
    const state = super.getDefaultState(props);
    if (!state.value) state.value = null;
    return state;
  }

  handleChange(value, event) {
    this.setValue(value, this.validate);
    invoke(this.props.onChange, event);
  }

  renderRadio(option, index) {
    const isChecked = this.state.value === option.value;
    const className = classNames('c-radio-item', {
      'is-checked': isChecked,
      'is-disabled': option.disabled,
    });
    const cleanProps = omit(this.props,
      'error',
      'className',
      'children',
      'type',
      'options',
      'defaultValue',
      'onUpdate',
    );

    let label;
    if (option.label) {
      label = (
        <strong className="c-radio-item-label ui-label ui-label-primary">{option.label}</strong>
      );
    }

    return (
      <label key={option.value} className={className}>
        <div className="c-radio-item-container">
          <span className="c-radio-item-control">
            <input
              {...cleanProps} ref={this.setEl('input')}
              disabled={option.disabled}
              type="radio"
              value={index}
              checked={isChecked}
              onChange={this.handleChange.bind(this, option.value)}
            />
            <i className="c-radio-item-state" />
          </span>
          {label}
        </div>
        {option.children}
      </label>
    );
  }

  render() {
    const { type, options, children } = this.props;
    const className = classNames('c-radio', this.props.className, {
      [`is-type-${type}`]: type,
      'is-error': this.isErrorActive(),
    });

    const radios = options.map(this.renderRadio);

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    return (
      <article className={className}>
        {radios}
        {children}
        {error}
      </article>
    );
  }
}

Radio.propTypes = {
  ...InputComponent.propTypes,

  className: PropTypes.string,
  children: PropTypes.node,

  options: PropTypes.array.isRequired,
  onChange: PropTypes.func,

  type: PropTypes.string,
};


Radio.prototype.setValue = throttle(Radio.prototype.setValue, CHECKBOX_CHANGE_RATE);
export default Radio;
