import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import clsx from 'clsx';

import CheckboxInputComponent from './base';


class Checkbox extends CheckboxInputComponent {
  render() {
    const {
      disabled,
      label,
      onChange,
      children,
    } = this.props;

    let labelNode;
    if (label) labelNode = <span className="ui-label ui-label-primary">{label}</span>;

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    const className = clsx('c-checkbox', this.props.className, {
      'is-error': error,
      'is-disabled': disabled,
      'is-checked': this.state.value,
      'has-label': label,
    });

    const cleanProps = omit(this.props,
      'label',
      'error',
      'className',
      'children',
      'defaultValue',
      'defaultChecked',
      'onUpdate',
    );

    return (
      <label className={className}>
        <div className="c-checkbox-container">
          <span className="c-checkbox-control">
            <input
              {...cleanProps} ref={this.setEl('input')}
              type="checkbox"
              onChange={this.actionChange(onChange)}
              checked={this.state.value}
            />
            <i className="c-checkbox-state icon-checkmark" />
          </span>
          {labelNode}
          {children}
        </div>
        {error}
      </label>
    );
  }
}

Checkbox.propTypes = {
  ...CheckboxInputComponent.propTypes,

  className: PropTypes.string,
  children: PropTypes.node,

  label: PropTypes.node,
  onChange: PropTypes.func,
};

export default Checkbox;
