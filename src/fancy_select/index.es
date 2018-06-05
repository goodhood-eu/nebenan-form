import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';

import { bindTo } from '../utils';

import InputComponent from '../base';


class FancySelect extends InputComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'renderOption',
    );
  }

  getDefaultState(props) {
    const state = super.getDefaultState(props);
    state.index = props.options.findIndex(({ value }) => value === state.value);
    if (state.index === -1) state.value = null;
    return state;
  }

  setValue(newValue, ...rest) {
    if (!this.isComponentMounted) return;

    const updater = (state, props) => {
      const index = props.options.findIndex(({ value }) => value === newValue);
      return { index };
    };
    const complete = () => super.setValue(newValue, ...rest);

    this.setState(updater, complete);
  }

  handleSelect(index) {
    let { value } = this.props.options[index];
    if (this.state.value === value) value = null;
    this.setValue(value, this.validate);
  }

  renderOption({ key, imageClass }, index) {
    const className = classNames('c-fancy_select-item', {
      'is-active': index === this.state.index,
    });

    const handler = this.handleSelect.bind(this, index);

    return (
      <li key={key} className={className} onClick={handler}>
        <i className={imageClass} />
        {key}
      </li>
    );
  }

  render() {
    const hasError = this.isErrorActive();
    const className = classNames('c-fancy_select', this.props.className, {
      'is-error': hasError,
    });
    const cleanProps = omit(this.props,
      'label', 'error', 'options', 'children', 'defaultValue', 'onUpdate', 'children', 'required',
    );

    const { label, options, children } = this.props;

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let error;
    if (hasError) error = <em className="ui-error">{this.getError()}</em>;

    return (
      <article {...cleanProps} className={className}>
        {labelNode}
        <ul className="c-fancy_select-list">{options.map(this.renderOption)}</ul>
        {children}
        {error}
      </article>
    );
  }
}

FancySelect.defaultProps = {
  options: [],
};

FancySelect.propTypes = {
  ...InputComponent.propTypes,
  className: PropTypes.string,
  children: PropTypes.node,

  options: PropTypes.array.isRequired,
};

export default FancySelect;
