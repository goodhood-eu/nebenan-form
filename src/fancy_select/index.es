import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';

import { bindTo, has } from '../utils';

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
    const hasValue = has(state, 'value');

    if (hasValue) {
      state.index = props.options.findIndex(({ value }) => value === state.value);
    }

    if ((state.index === -1 || !hasValue) && !props.deselectable) {
      state.index = 0;
      state.value = props.options[state.index].value;
    }

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

  setPristine(done) {
    if (!this.isComponentMounted) return;
    const updater = (state, props) => omit(this.getDefaultState(props), 'index', 'value');
    this.setState(updater, done);
  }

  handleSelect(index) {
    const { options, deselectable } = this.props;
    let { value } = options[index];

    if (this.state.value === value) {
      if (deselectable) value = undefined;
      else return;
    }

    this.setValue(value, this.validate);
  }

  renderOption({ key, imageClass, children }, index) {
    const { disabled } = this.props;

    const className = classNames('c-fancy_select-item', {
      'is-active': index === this.state.index,
    });

    const handler = disabled ? null : this.handleSelect.bind(this, index);
    const content = children || key;

    let icon;
    if (imageClass) icon = <i className={imageClass} />;

    return <li key={key} className={className} onClick={handler}>{icon}{content}</li>;
  }

  render() {
    const hasError = this.isErrorActive();
    const { disabled, label, options, deselectable, children } = this.props;

    const className = classNames('c-fancy_select', this.props.className, {
      'is-disabled': disabled,
      'is-error': hasError,
      'is-not-deselectable': !deselectable,
    });
    const cleanProps = omit(this.props,
      'label', 'error', 'options', 'deselectable',
      'children', 'defaultValue', 'onUpdate', 'children', 'required', 'disabled',
    );

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
  deselectable: false,
};

FancySelect.propTypes = {
  ...InputComponent.propTypes,
  className: PropTypes.string,
  children: PropTypes.node,

  options: PropTypes.array.isRequired,
  deselectable: PropTypes.bool.isRequired,
};

export default FancySelect;
