import React from 'react';
import Link from 'react-router/lib/Link';

export default () => (
  <article>
    <header>
      <h1>Error 404</h1>
    </header>
    <div>
      <p>No such route.</p>
      <Link to="/" className="ui-button ui-button-primary">Back to index.</Link>
    </div>
  </article>
);
