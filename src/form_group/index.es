import React, { Children } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';


const renderChild = (child) => <div className="c-form_group-item">{child}</div>;

const FormGroup = (props) => {
  const size = props.children ? props.children.length : 0;
  const className = classNames('c-form_group', props.className, {
    [`is-multiple is-size-${size}`]: size > 1,
  });
  const children = Children.map(props.children, renderChild);

  return <div className={className}>{children}</div>;
};

FormGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default FormGroup;
