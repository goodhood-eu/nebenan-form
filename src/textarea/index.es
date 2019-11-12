import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import debounce from 'lodash/debounce';
import classNames from 'classnames';

import { invoke, bindTo } from '../utils';
import TextInputComponent from '../input/base';
import { RESIZE_RATE } from '../constants';


class Textarea extends TextInputComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'updateHeight',
    );
  }

  componentDidMount() {
    super.componentDidMount();
    this.updateHeight();
    this.debouncedHandler = debounce(this.updateHeight, RESIZE_RATE);
    window.addEventListener('resize', this.debouncedHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedHandler);
    super.componentWillUnmount();
  }

  // https://maximilianhoffmann.com/posts/autoresizing-textareas
  updateHeight() {
    // ref can be null in delayed function
    if (!this.els.input) return;

    // has to go first, to make scrollHeight recalculate
    this.els.input.style.height = 'auto';

    const { input } = this.els;
    const { scrollHeight: height } = input;

    input.style.height = `${height}px`;
    input.scrollTop = height;

    invoke(this.props.onUpdateHeight);
  }

  reset(done) {
    const complete = () => {
      this.updateHeight();
      invoke(done);
    };

    super.reset(complete);
  }

  setValue(value, done) {
    const complete = () => {
      this.updateHeight();
      invoke(done);
    };

    super.setValue(value, complete);
  }

  render() {
    const {
      onEnterKey,
      onShiftEnterKey,
      label,
      onChange,
      onFocus,
      onBlur,
      children,
    } = this.props;

    const className = classNames('c-textarea', this.props.className);

    const cleanProps = omit(this.props,
      'label',
      'error',
      'children',
      'onUpdateHeight',
      'onGetValue',
      'validate',
      'onEnterKey',
      'onShiftEnterKey',
      'onUpdate',
      'defaultValue',
    );

    const inputClassName = classNames('ui-input', {
      'ui-input-error': this.isErrorActive(),
    });
    if (onEnterKey || onShiftEnterKey) cleanProps.onKeyDown = this.handleKeyDown;

    let labelNode;
    if (label) labelNode = <strong className="ui-label">{label}</strong>;

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    // Needs rows="1" for `auto` height to determine height correctly
    return (
      <label className={className}>
        {labelNode}
        <div className="c-textarea-container">
          <textarea
            {...cleanProps}
            ref={this.setEl('input')} className={inputClassName} rows="1"
            onChange={this.actionChange(onChange)}
            onFocus={this.actionClearError(onFocus)}
            onBlur={this.actionValidate(onBlur)}
            value={this.state.value}
          />
          {children}
        </div>
        {error}
      </label>
    );
  }
}

Textarea.propTypes = {
  ...TextInputComponent.propTypes,

  className: PropTypes.string,
  children: PropTypes.node,
  label: PropTypes.node,

  onUpdateHeight: PropTypes.func,

  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Textarea;
