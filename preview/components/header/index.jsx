import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = ({ children, noLink }) => (
  <header className="preview-header">
    {noLink ? null : <Link to="/">&lt;</Link>}
    <h2>{children}</h2>
  </header>
);

Header.defaultProps = {
  noLink: false,
};

Header.propTypes = {
  children: PropTypes.node,
  noLink: PropTypes.bool.isRequired,
};

export default Header;
