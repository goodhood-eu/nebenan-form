import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';
import throttle from 'lodash/throttle';

import {
  size,
  scroll,
  documentOffset,
  getPrefixed,
  stopEvent,
  eventCoordinates,
} from 'nebenan-helpers/lib/utils/dom';
import eventproxy from 'nebenan-helpers/lib/eventproxy';

import InteractiveComponent from 'nebenan-base-class/lib/interactive_component';

const UPDATE_RATE = 20;
const MIN_SCROLLER_HEIGHT = 20;


class Scrollable extends InteractiveComponent {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();

    this.bindToComponent(
      'reset',
      'resize',
      'syncScrollPosition',
      'handleResize',
      'handleMouseEnter',
      'handleMouseLeave',
      'handleWheel',
      'handleSwipeStart',
      'handleSwipe',
      'handleSwipeEnd',
      'handleScroll',
      'handleClick',
      'handleLoad',
    );

    this.controlHeight = 0;
    this.contentHeight = 0;
    this.ratio = 1;
    this.controlOffsetTop = 0;
    this.scrolled = 0;
  }

  componentDidMount() {
    super.componentDidMount();
    this.scroll = scroll(this.els.container);
    this.updateScrollPosition = throttle(this.updateScrollPosition, UPDATE_RATE);
    this.stopListeningToResize = eventproxy('resize', this.handleResize);
    this.resize();
  }

  componentWillUnmount() {
    this.deactivateSwipe();
    this.stopListeningToResize();
    super.componentWillUnmount();
  }

  getDefaultState() {
    return {
      isActive: false,
      scrollPosition: 0,
      containerWidth: 0,
      sliderHeight: MIN_SCROLLER_HEIGHT,
    };
  }

  reset(done) {
    const complete = () => {
      this.scroll.to(0);
      this.resize(done);
    };

    this.setState(this.getDefaultState(), complete);
  }

  resize(done) {
    const componentSize = size(this.els.component);

    this.controlHeight = componentSize.height;
    this.contentHeight = size(this.els.content).height;
    this.ratio = (this.controlHeight ** 2) / this.contentHeight;
    this.controlOffsetTop = documentOffset(global, this.els.component).top;

    const containerWidth = componentSize.width;
    const sliderHeight = Math.max(MIN_SCROLLER_HEIGHT, this.ratio);

    this.setState({ containerWidth, sliderHeight }, done);
  }

  updateScrollPosition() {
    const percent = this.scrolled / this.contentHeight;
    const errorMargin = this.ratio - this.state.sliderHeight;
    const scrollPosition = percent * (this.controlHeight + errorMargin);

    this.setState({ scrollPosition });
  }

  syncScrollPosition() {
    this.scrolled = this.scroll.get();
    this.updateScrollPosition();
  }

  setControlPosition(position) {
    const contentDiff = (position * this.contentHeight) / this.controlHeight;
    this.scroll.to(contentDiff);
  }

  activate() {
    if (this.state.isActive) return;
    // Only activate when there is something to scroll
    const complete = () => this.setState({ isActive: this.contentHeight > this.controlHeight });
    this.resize(complete);
  }

  deactivate() {
    if (!this.state.isActive) return;
    this.setState({ isActive: false });
  }

  activateSwipe() {
    if (this.isSwipeActive) return;
    document.addEventListener('mousemove', this.handleSwipe);
    document.addEventListener('touchmove', this.handleSwipe);
    document.addEventListener('mouseup', this.handleSwipeEnd);
    document.addEventListener('touchend', this.handleSwipeEnd);
    this.isSwipeActive = true;
  }

  deactivateSwipe() {
    if (!this.isSwipeActive) return;
    document.removeEventListener('mousemove', this.handleSwipe);
    document.removeEventListener('touchmove', this.handleSwipe);
    document.removeEventListener('mouseup', this.handleSwipeEnd);
    document.removeEventListener('touchend', this.handleSwipeEnd);
    this.isSwipeActive = false;
  }

  handleResize() {
    this.resize();
  }

  handleMouseEnter(event) {
    this.activate();
    if (this.props.onMouseEnter) this.props.onMouseEnter(event);
  }

  handleMouseLeave(event) {
    this.deactivate();
    if (this.props.onMouseLeave) this.props.onMouseLeave(event);
  }

  handleWheel(event) {
    const expectedPosition = this.scrolled + event.deltaY;
    const minPosition = 0;
    const maxPosition = this.contentHeight - this.controlHeight;

    let canScroll;
    let target;
    if (event.deltaY > 0) {
      canScroll = expectedPosition < maxPosition;
      target = maxPosition;
    } else {
      canScroll = expectedPosition > minPosition;
      target = minPosition;
    }

    if (!canScroll) {
      this.scroll.to(target);
      return stopEvent(event);
    }

    if (this.props.onWheel) return this.props.onWheel(event);
  }

  handleSwipeStart(event) {
    this.activateSwipe();
    this.startY = eventCoordinates(event, 'pageY').pageY;
    this.startPosition = this.state.scrollPosition;
  }

  handleSwipe(event) {
    const { pageY } = eventCoordinates(event, 'pageY');
    const position = this.startPosition + pageY - this.startY;
    this.setControlPosition(position);
  }

  handleSwipeEnd() {
    this.deactivateSwipe();
    this.startY = null;
    this.startPosition = null;
    this.preventClick = true;
  }

  handleScroll() {
    if (!this.state.isActive) this.activate();
    this.syncScrollPosition();
  }

  handleClick(event) {
    if (this.preventClick) {
      this.preventClick = false;
      return;
    }

    const position = event.pageY - this.controlOffsetTop - (this.state.sliderHeight / 2);
    this.setControlPosition(position);
  }

  handleLoad() {
    this.resize(this.syncScrollPosition);
  }

  render() {
    const className = classNames('c-scrollable', this.props.className);
    const cleanProps = omit(this.props, 'children');
    const controlClassName = classNames('c-scrollable-control', {
      'is-active': this.state.isActive,
    });

    // Fixes issue with most browsers reducing width of the scrollable element children
    // as if to compensate for scrollbars, even when they are hidden
    const contentStyle = { width: this.state.containerWidth };

    const scrollerStyle = getPrefixed({ transform: `translateY(${this.state.scrollPosition}px)` });
    scrollerStyle.height = this.state.sliderHeight;

    return (
      <article
        {...cleanProps} className={className}
        ref={this.setEl('component')} onWheel={this.handleWheel}
        onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}
      >
        <div
          className="c-scrollable-container" ref={this.setEl('container')}
          onScroll={this.handleScroll} onTouchMove={this.handleScroll}
        >
          <div
            className="c-scrollable-content"
            ref={this.setEl('content')}
            onLoad={this.handleLoad}
            style={contentStyle}
          >
            {this.props.children}
          </div>
        </div>
        <span className={controlClassName} onClick={this.handleClick}>
          <i
            style={scrollerStyle}
            onTouchStart={this.handleSwipeStart}
            onMouseDown={this.handleSwipeStart}
          />
        </span>
      </article>
    );
  }
}

Scrollable.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onWheel: PropTypes.func,
};

export default Scrollable;
