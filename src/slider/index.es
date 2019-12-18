import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';

import eventproxy from '../utils/eventproxy';
import { documentOffset, size, getPrefixed, eventCoordinates } from '../utils/dom';
import { bindTo, invoke } from '../utils';

import InputComponent from '../base';
import { ensureValueBounds, convertValueToPercent, convertPercentToValue } from './utils';


class Slider extends InputComponent {
  constructor(props) {
    super(props);
    bindTo(this,
      'handleGlobalClick',
      'handleResize',
      'handleClick',
      'handleSwipeStart',
      'handleSwipe',
      'handleSwipeEnd',
    );
  }

  componentDidMount() {
    super.componentDidMount();
    this.stopListeningToClicks = eventproxy('click', this.handleGlobalClick);
    this.stopListeningToResize = eventproxy('resize', this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    this.deactivateSwipe();
    this.stopListeningToClicks();
    this.stopListeningToResize();
    super.componentWillUnmount();
  }

  getDefaultState(props) {
    const state = super.getDefaultState(props);
    state.value = ensureValueBounds(state.value || 0, props.min, props.max);
    state.percent = convertValueToPercent(state.value, props.min, props.max);
    return state;
  }

  getTrackOffset() {
    return documentOffset(global, this.els.track).left;
  }

  handleGlobalClick(event) {
    if (!this.isComponentMounted) return;

    if (!this.isPristine() && !this.els.container.contains(event.target)) this.validate();
  }

  handleResize() {
    if (!this.isComponentMounted) return;

    // refs can be null in delayed function
    if (!this.els.track) return;

    const trackWidth = size(this.els.track).width;
    this.setState({ trackWidth });
  }

  activateSwipe() {
    if (this.isActive) return;
    document.addEventListener('mousemove', this.handleSwipe);
    document.addEventListener('touchmove', this.handleSwipe);
    document.addEventListener('mouseup', this.handleSwipeEnd);
    document.addEventListener('touchend', this.handleSwipeEnd);
    this.setError(null);
    this.isActive = true;
  }

  deactivateSwipe() {
    if (!this.isActive) return;
    document.removeEventListener('mousemove', this.handleSwipe);
    document.removeEventListener('touchmove', this.handleSwipe);
    document.removeEventListener('mouseup', this.handleSwipeEnd);
    document.removeEventListener('touchend', this.handleSwipeEnd);
    this.isActive = false;
  }

  handleClick(event) {
    this.setPosition(event.pageX - this.getTrackOffset(), this.validate);
  }

  handleSwipeStart() {
    this.activateSwipe();
    this.trackOffset = this.getTrackOffset();
  }

  handleSwipe(event) {
    event.preventDefault();
    const { pageX } = eventCoordinates(event, 'pageX');
    this.setPosition(pageX - this.trackOffset);
  }

  handleSwipeEnd() {
    this.deactivateSwipe();
    this.trackOffset = null;
  }

  setPosition(position, done) {
    const percent = ensureValueBounds(position / this.state.trackWidth, 0, 1);
    const value = convertPercentToValue(percent, this.props.min, this.props.max, this.props.step);

    if (value !== this.state.value) this.setValue(value, done);
    else invoke(done);
  }

  setValue(value, done) {
    this.setState((state, props) => ({
      percent: convertValueToPercent(value, props.min, props.max),
    }));
    super.setValue(value, done);
  }

  render() {
    const { value, percent, trackWidth } = this.state;
    const { getLabel, label } = this.props;
    const cleanProps = omit(this.props,
      'label',
      'error',
      'validate',
      'required',
      'children',
      'min',
      'max',
      'step',
      'getLabel',
      'onUpdate',
    );
    const className = classNames('c-slider', this.props.className, {
      'is-error': this.isErrorActive(),
    });
    const style = getPrefixed({ transform: `translateX(${percent * trackWidth}px)` });
    const labelContent = getLabel ? getLabel(value) : value;
    const error = this.isErrorActive() ? <em className="ui-error">{this.getError()}</em> : null;

    return (
      <article {...cleanProps} className={className} ref={this.setEl('container')}>
        <strong className="ui-label">{label}</strong>
        <div className="c-slider-track" ref={this.setEl('track')} onClick={this.handleClick}>
          <span className="c-slider-line" />
          <span
            ref={this.setEl('handle')}
            className="c-slider-handle"
            style={style}
            onTouchStart={this.handleSwipeStart}
            onMouseDown={this.handleSwipeStart}
          >
            <em className="c-slider-label">{labelContent}</em>
          </span>
        </div>
        {error}
      </article>
    );
  }
}

Slider.propTypes = {
  ...InputComponent.propTypes,

  className: PropTypes.string,
  step: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  getLabel: PropTypes.func,
  label: PropTypes.string,
};

Slider.defaultProps = {
  step: 1,
  min: 0,
  max: 10,
};

export default Slider;
