import React from 'react';
import PropTypes from 'prop-types';
import InputComponent from 'nebenan-base-class/lib/input_component';

import omit from 'lodash/omit';
import classNames from 'classnames';

import { has } from 'nebenan-helpers/lib/utils/data';
import { getOption, findIndex } from './utils';


class Select extends InputComponent {
  constructor(props) {
    super(props);
    this.bindToComponent(
      'handleChange',
    );
  }

  getDefaultState(props) {
    const state = super.getDefaultState(props);
    const hasValue = has(state, 'value');
    if (hasValue) {
      state.index = findIndex(props, state.value);
    }

    if (state.index === -1 || !hasValue) {
      state.index = 0;
      state.value = getOption(props.options[state.index]).value;
    }

    return state;
  }

  setValue(newValue, ...rest) {
    if (!this.isComponentMounted) return;

    const updater = (state, props) => ({ index: findIndex(props, newValue) });
    const complete = () => super.setValue(newValue, ...rest);
    this.setState(updater, complete);
  }

  handleChange(event) {
    const index = parseInt(event.target.value, 10);
    const { value } = getOption(this.props.options[index]);
    this.setValue(value, this.validate);
  }

  renderOption(item, index) {
    const { key } = getOption(item);
    return <option value={index} key={key}>{key}</option>;
  }

  render() {
    const className = classNames('c-select', this.props.className);
    const cleanProps = omit(this.props, 'label', 'error', 'options', 'children', 'defaultValue', 'onUpdate');
    const hasError = this.isErrorActive();

    const inputClassName = classNames('ui-input', { 'ui-input-error': hasError });
    const options = this.props.options.map(this.renderOption);

    let error;
    if (hasError) error = <em className="ui-error">{this.getError()}</em>;

    return (
      <label className={className}>
        <strong className="ui-label">{this.props.label}</strong>
        <div className="c-select-container">
          <select
            {...cleanProps} ref={this.setEl('input')} className={inputClassName}
            onChange={this.handleChange}
            onBlur={this.actionValidate(this.props.onBlur)}
            value={this.state.index}
          >
            {options}
          </select>
          <i className="c-select-icon icon-arrow_down" />
          {this.props.children}
        </div>
        {error}
      </label>
    );
  }
}

Select.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,

  options: PropTypes.array.isRequired,

  label: PropTypes.node,
  onBlur: PropTypes.func,

  validate: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]),

  required: PropTypes.bool,
  pattern: PropTypes.string,
  defaultValue: PropTypes.any,

  error: PropTypes.string,
  name: PropTypes.string,

  onUpdate: PropTypes.func,
  onError: PropTypes.func,
};

export default Select;
