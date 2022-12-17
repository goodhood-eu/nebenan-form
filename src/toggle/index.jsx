import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import clsx from 'clsx';

import CheckboxInputComponent from '../checkbox/base';


class Toggle extends CheckboxInputComponent {
  render() {
    const {
      disabled,
      label,
      labelOn,
      labelOff,
      onChange,
      children,
    } = this.props;

    let labelNode;
    if (label) {
      labelNode = <span className="ui-label ui-label-primary c-toggle-label">{label}</span>;
    }

    let error;
    if (this.isErrorActive()) error = <em className="ui-error">{this.getError()}</em>;

    const className = clsx('c-toggle', this.props.className, {
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
      'labelOn',
      'labelOff',
    );

    return (
      <label className={className}>
        <div className="c-toggle-container">
          <span className="c-toggle-control">
            <input
              {...cleanProps} ref={this.setEl('input')}
              type="checkbox"
              onChange={this.actionChange(onChange)}
              checked={this.state.value}
            />
            <span className="c-toggle-slide">
              <span className="c-toggle-state">
                <em className="is-positive">{labelOn}</em>
                <i />
                <em>{labelOff}</em>
              </span>
            </span>
          </span>
          {labelNode}
          {children}
        </div>
        {error}
      </label>
    );
  }
}

Toggle.propTypes = {
  ...CheckboxInputComponent.propTypes,

  className: PropTypes.string,
  children: PropTypes.node,

  label: PropTypes.node,
  labelOn: PropTypes.node,
  labelOff: PropTypes.node,

  onChange: PropTypes.func,
};

export default Toggle;
