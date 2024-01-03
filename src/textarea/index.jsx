import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import { attach } from '@frsource/autoresize-textarea';
import clsx from 'clsx';

import { invoke } from '../utils';
import TextInputComponent from '../input/base';


class Textarea extends TextInputComponent {
  componentDidMount() {
    super.componentDidMount();
    const { detach } = attach(this.els.input);
    this.detatch = detach;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debouncedHandler, { passive: true });
    this.detatch();
    super.componentWillUnmount();
  }

  reset(done) {
    const complete = () => {
      invoke(done);
    };

    super.reset(complete);
  }

  setValue(value, done) {
    const complete = () => {
      invoke(done);
    };

    super.setValue(value, complete);
  }

  /**
   * @override adjust to match HTMLTextAreaElement value stripping
   */
  isDOMValueEqualTo(domValue, rawValue) {
    const getDOMStrippedValue = (originalValue) => {
      const textareaElement = document.createElement('textarea');
      const textNode = document.createTextNode(originalValue);
      textareaElement.appendChild(textNode);
      return textareaElement.value;
    };

    return domValue === getDOMStrippedValue(rawValue);
  }

  render() {
    const {
      onEnterKey,
      onShiftEnterKey,
      label,
      disabled,
      onChange,
      onFocus,
      onBlur,
      children,
    } = this.props;

    const className = clsx('c-textarea', this.props.className, {
      'is-disabled': disabled,
    });

    const cleanProps = omit(this.props,
      'label',
      'error',
      'children',
      'onGetValue',
      'validate',
      'onEnterKey',
      'onShiftEnterKey',
      'onUpdate',
      'defaultValue',
    );

    const inputClassName = clsx('ui-input', {
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

  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Textarea;
