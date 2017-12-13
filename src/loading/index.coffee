React = require('react')

classNames = require('classnames')
{ connect } = require('react-redux')


ANIMATION_DURATION = 400

class LoadingBar extends React.PureComponent
  constructor: (props) ->
    super(props)
    @state =
      isActive: @props.isNetworkActive
      isComplete: false

  clear: -> clearTimeout(@_tid) if @_tid?
  reset: => @setState(isActive: false, isComplete: false)

  componentWillUnmount: -> @clear()
  componentWillReceiveProps: (nextProps) ->
    if nextProps.isNetworkActive
      @setState(isActive: true, isComplete: false)
    else if @state.isActive
      @setState(isComplete: true)

    @clear()
    @_tid = setTimeout(@reset, ANIMATION_DURATION)

  render: ->
    klass = classNames('c-loading-bar',
      'is-active': @state.isActive
      'is-complete': @state.isComplete
    )
    <span className={klass}><i /></span>

mapStateToProps = (state) -> { isNetworkActive: state.network.isNetworkActive }
LoadingBar = connect(mapStateToProps)(LoadingBar)

LoadingSpinner = -> <aside className="c-loading-spinner"><i /></aside>

module.exports = { LoadingBar, LoadingSpinner }
