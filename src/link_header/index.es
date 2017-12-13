import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link from '../link';


const LinkHeader = (props) => {
  const className = classNames('c-link_header', props.className);
  const { children, title, to, ...cleanProps } = props;

  const header = <span className="ui-h3">{title}</span>;
  if (!to) return <span {...cleanProps} className={className}>{header}{children}</span>;

  const icon = <i className="icon-arrow_right" />;
  return <Link {...cleanProps} {...{ to, className }}>{icon}{header}{children}</Link>;
};

LinkHeader.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  to: PropTypes.string,
  children: PropTypes.node,
};

export default LinkHeader;
