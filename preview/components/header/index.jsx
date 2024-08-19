import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Header = ({ children, noLink = false }) => (
  <header className="preview-header">
    {noLink ? null : <Link to="/">&lt;</Link>}
    <h2>{children}</h2>
  </header>
);

Header.propTypes = {
  children: PropTypes.node,
  noLink: PropTypes.bool,
};

export default Header;
