import React, { Children } from 'react';
import PropTypes from 'prop-types';
import InteractiveComponent from 'nebenan-base-class/lib/interactive_component';
import classNames from 'classnames';
import clamp from 'lodash/clamp';

import eventproxy from 'nebenan-helpers/lib/eventproxy';
import { getPrefixed, eventCoordinates, size } from 'nebenan-helpers/lib/utils/dom';
import Draggable from '../draggable';

const BOUNDARIES_EXCESS = 40;


class Carousel extends InteractiveComponent {
  constructor(props) {
    super(props);
    this.state = { position: 0, isAnimated: false };

    this.bindToComponent(
      'handleDragStart',
      'handleDrag',
      'handleDragStop',
      'handleResize',
    );
  }

  componentDidMount() {
    super.componentDidMount();
    this.stopListeningToResize = eventproxy('resize', this.handleResize);
    this.calculateMeasurements();
  }

  componentWillUnmount() {
    this.stopListeningToResize();
    super.componentWillUnmount();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      process.nextTick(this.handleResize);
    }
  }

  calculateMeasurements() {
    const containerWidth = size(this.els.draggable.getNode()).width;
    const wrapperWidth = size(this.els.wrapper).width;

    this.minPosition = Math.min(wrapperWidth - containerWidth, 0);
  }

  alignPosition() {
    const position = clamp(this.state.position, this.minPosition, 0);
    this.setPosition(position, true);
  }

  setPosition(position, isAnimated = false) {
    this.setState({ position, isAnimated });
  }

  handleResize() {
    if (!this.isComponentMounted) return;
    this.calculateMeasurements();
    this.alignPosition();
  }

  handleDragStart(event) {
    this.startPosition = this.state.position;
    this.startX = eventCoordinates(event, 'pageX').pageX;
  }

  handleDrag(event) {
    const diff = eventCoordinates(event, 'pageX').pageX - this.startX;
    const minPosition = this.minPosition - BOUNDARIES_EXCESS;
    const position = clamp(this.startPosition + diff, minPosition, BOUNDARIES_EXCESS);

    this.setPosition(position);
  }

  handleDragStop() {
    this.alignPosition();
  }

  renderItem(item) {
    return <li className="c-carousel-item">{item}</li>;
  }

  render() {
    const className = classNames('c-carousel', this.props.className, { 'is-animated': this.state.isAnimated });
    const { children, ...cleanProps } = this.props;
    const items = Children.map(children, this.renderItem);

    const draggableStyle = getPrefixed({ transform: `translateX(${this.state.position}px)` });

    return (
      <article {...cleanProps} className={className}>
        <div className="c-carousel-wrapper" ref={this.setEl('wrapper')}>
          <Draggable
            ref={this.setEl('draggable')}
            style={draggableStyle}
            className="c-carousel-draggable"
            onDragStart={this.handleDragStart}
            onDrag={this.handleDrag}
            onDragStop={this.handleDragStop}
          >
            <ul className="c-carousel-list">{items}</ul>
          </Draggable>
        </div>
      </article>
    );
  }
}

Carousel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Carousel;
