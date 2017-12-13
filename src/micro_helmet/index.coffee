# A mixture of https://github.com/nfl/react-helmet and https://github.com/gaearon/react-document-title
React = require('react')
PropTypes = require('prop-types')
withSideEffect = require('react-side-effect')

stringRegex = /\%s/g
proxyProps = [
  'title'
  'description'
  'image'
  'robots'
  'canonical'
]

parseProps = (headProps) ->
  { title, titleTemplate, defaultTitle } = headProps
  result = {}

  for prop in proxyProps when headProps[prop]
    result[prop] = headProps[prop]

  if title and titleTemplate
    result.title = titleTemplate.replace(stringRegex, title)
  else if not title and defaultTitle
    result.title = defaultTitle

  result

reducePropsToState = (propsList) ->
  result = {}
  Object.assign(result, headProps) for headProps in propsList
  parseProps(result)

handleStateChangeOnClient = ({ title }) ->
  document.title = title if title and title isnt document.title


class MicroHelmet extends React.PureComponent
  @propTypes:
    title: PropTypes.string
    defaultTitle: PropTypes.string
    titleTemplate: PropTypes.string
    description: PropTypes.string
    image: PropTypes.string
    robots: PropTypes.string
    canonical: PropTypes.string

  render: -> if @props.children then React.Children.only(@props.children) else null

module.exports = withSideEffect(reducePropsToState, handleStateChangeOnClient)(MicroHelmet)
