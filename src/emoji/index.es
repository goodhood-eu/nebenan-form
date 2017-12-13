import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { shortenString } from 'nebenan-helpers/lib/utils/strings';
import { render } from 'nebenan-helpers/lib/emoji';


const Emoji = (props) => {
  const className = classNames('c-emoji', props.className);
  const { limit, text, ...cleanProps } = props;

  const content = typeof limit === 'number' ? shortenString(text, limit) : text;
  const safeContent = { __html: render(content) };

  return <span {...cleanProps} className={className} dangerouslySetInnerHTML={safeContent} />;
};

Emoji.propTypes = {
  className: PropTypes.string,

  limit: PropTypes.number,
  text: PropTypes.string.isRequired,
};

export default Emoji;
