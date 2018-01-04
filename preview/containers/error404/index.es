import React from 'react';
import Link from 'react-router/lib/Link';
import Header from '../../components/header';

export default () => (
  <article>
    <Header>Error 404</Header>
    <div>
      <p>No such route.</p>
      <Link to="/" className="ui-button ui-button-primary">Back to index</Link>
    </div>
  </article>
);
