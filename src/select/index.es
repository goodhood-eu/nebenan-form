import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';

import { bindTo, has } from '../utils';
import { getOption, findIndex } from './utils';

import InputComponent from '../base';


class Select extends InputComponent {
  constructor(props) {
    super(props);
    bindTo(this,
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

  setPristine(done) {
    if (!this.isComponentMounted) return;
    const updater = (state, props) => omit(this.getDefaultState(props), 'index', 'value');
    this.setState(updater, done);
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
    const { disabled, options, label, onBlur, children } = this.props;
    const className = classNames('c-select', this.props.className, {
      'is-disabled': disabled,
    });
    const cleanProps = omit(
      this.props, 'label', 'error', 'options', 'validate', 'children', 'defaultValue', 'onUpdate',
    );
    const hasError = this.isErrorActive();

    const inputClassName = classNames('ui-input', { 'ui-input-error': hasError });
    const optionsNode = options.map(this.renderOption);

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let error;
    if (hasError) error = <em className="ui-error">{this.getError()}</em>;

    return (
      <label className={className}>
        {labelNode}
        <div className="c-select-container">
          <select
            {...cleanProps} ref={this.setEl('input')} className={inputClassName}
            onChange={this.handleChange}
            onBlur={this.actionValidate(onBlur)}
            value={this.state.index}
          >
            {optionsNode}
          </select>
          <i className="c-select-icon icon-arrow_down" />
          {children}
        </div>
        {error}
      </label>
    );
  }
}

Select.propTypes = {
  ...InputComponent.propTypes,
  className: PropTypes.string,
  children: PropTypes.node,

  options: PropTypes.array.isRequired,

  label: PropTypes.node,
  onBlur: PropTypes.func,
};

export default Select;
