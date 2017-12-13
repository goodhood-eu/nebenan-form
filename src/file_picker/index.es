import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';


class FilePicker extends PureComponent {
  constructor(props) {
    super(props);
    this.els = {};
    this.handleChange = this.handleChange.bind(this);
  }

  getInput() {
    return this.els.input;
  }

  handleChange(event) {
    const { files } = event.target;

    // some browsers trigger change with empty set
    if (this.props.onSelect && files.length) this.props.onSelect(files);

    if (this.props.onChange) this.props.onChange(event);
    this.els.input.value = '';
  }

  render() {
    const className = classNames('c-file_picker', this.props.className);
    const cleanProps = omit(this.props, 'onSelect', 'children', 'className');

    return (
      <span className={className}>
        {this.props.children}
        <input
          {...cleanProps}
          ref={(node) => { this.els.input = node; }}
          type="file"
          className="c-file_picker-input"
          onChange={this.handleChange}
        />
      </span>
    );
  }
}

FilePicker.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
};

export default FilePicker;
