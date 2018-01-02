const app = require('express')();

const React = require('react');
const { renderToString } = require('react-dom/server');

const match = require('react-router/lib/match');
const RouterContext = require('react-router/lib/RouterContext');
const createRouter = require('./router').default;
const Error404 = require('../../client/containers/error_404');

const port = parseInt(process.env.PORT, 10) || 3000;

const getHTML = (content) => (`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Preview</title>
  </head>
  <body>
    ${content}
  </body>
</html>
`);

const renderApp = (req, res, next) => {
  const renderPage = (props) => {
    const statusCode = props.components.includes(Error404) ? 404 : 200;

    const Component = React.createElement(RouterContext, props);
    const content = renderToString(Component);

    res.status(statusCode).send(getHTML(content));
  };

  const matchPage = (error, redirect, props) => {
    if (error) {
      console.log(`Request ${req.url} failed to route:`, error.message);
      return next();
    }

    if (redirect) return res.redirect(302, `${redirect.pathname}${redirect.search}`);

    // if there was no props, this request isn't handled by FE explicitly
    if (!props) return next();

    renderPage(props);
  };

  const { routes } = createRouter();
  match({ routes, location: req.url }, matchPage);
};

app.set('port', port);

app.use(require('morgan')('dev'));
app.use(require('serve-static')(`${__dirname}/../public`, { redirect: false }));

app.use(renderApp);
app.get('*', (req, res) => res.send('Unhandled request'));
app.use(require('errorhandler')({ dumpExceptions: true, showStack: true }));

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
