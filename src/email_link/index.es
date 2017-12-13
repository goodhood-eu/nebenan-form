import React from 'react';
import PropTypes from 'prop-types';
import { stringify } from 'querystring';


const EmailLink = (props) => {
  const { address, subject, body, children, ...cleanProps } = props;
  const query = stringify({ subject, body });

  const uri = `mailto:${address}?${query}`;
  const content = children || address;

  return <a {...cleanProps} href={uri}>{content}</a>;
};

EmailLink.propTypes = {
  children: PropTypes.node,
  address: PropTypes.string.isRequired,
  subject: PropTypes.string,
  body: PropTypes.string,
};

export default EmailLink;
