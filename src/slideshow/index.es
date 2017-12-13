import React, { Children } from 'react';
import PropTypes from 'prop-types';
import InteractiveComponent from 'nebenan-base-class/lib/interactive_component';

import classNames from 'classnames';
import omit from 'lodash/omit';
import clamp from 'lodash/clamp';

import eventproxy from 'nebenan-helpers/lib/eventproxy';
import heartbeat from 'nebenan-helpers/lib/heartbeat';
import { getPrefixed, eventCoordinates, size } from 'nebenan-helpers/lib/utils/dom';
import {
  BOUNDARIES_EXCESS, DISABLE_SCROLL_DISTANCE, SWIPE_TRIGGER_DISTANCE,
  getItemWidth, getGridPosition, getActiveSection,
  getSectionsCount, isItemWidthChanged, getPositionOptions,
} from './utils';

import Draggable from '../draggable';
import Dots from '../dots';


class Slideshow extends InteractiveComponent {
  constructor(props) {
    super(props);

    this.state = this.getDefaultState();

    this.bindToComponent(
      'snapToGrid',
      'setSection',
      'nextSection',
      'prevSection',

      'handleDragStart',
      'handleDrag',
      'handleDragStop',

      'handleResize',

      'renderItem',
    );
  }

  componentDidMount() {
    super.componentDidMount();
    this.startAutoRotation();
    this.stopListeningToResize = eventproxy('resize', this.handleResize);
    this.calculateMeasurements();
  }

  componentWillUnmount() {
    this.stopListeningToResize();
    this.stopAutoRotation();
    super.componentWillUnmount();
  }

  componentDidUpdate(prevProps) {
    const isLengthChanged = prevProps.items.length !== this.props.items.length;
    const itemWidthChanged = isItemWidthChanged(prevProps, this.props);

    if (isLengthChanged || itemWidthChanged) this.handleResize();
  }

  getDefaultState() {
    return {
      position: 0,
      section: 0,
      isAnimated: false,

      sceneWidth: 0,
      itemWidth: 0,
      listWidth: 0,
    };
  }

  startAutoRotation() {
    if (this.props.rotationInterval) {
      this.stopAutoRotation();
      this.removeRotationListener = heartbeat(this.props.rotationInterval, this.nextSection);
    }
  }

  stopAutoRotation() {
    if (this.removeRotationListener) {
      this.removeRotationListener();
      this.removeRotationListener = null;
    }
  }

  getValidPosition(position) {
    return clamp(position, this.minPosition, 0);
  }

  setSection(index) {
    const position = index * this.state.sceneWidth * -1;
    this.setPosition(this.getValidPosition(position));

    this.startAutoRotation();
  }

  setPosition(position, options = getPositionOptions()) {
    const updater = (state) => ({
      position,
      section: getActiveSection(position, state.sceneWidth),
      isAnimated: options.animated,
    });

    let done;
    if (this.props.onChange) done = () => { this.props.onChange(this.state.section); };

    this.setState(updater, done);
  }

  snapToGrid() {
    const position = getGridPosition(this.state.position, this.state.sceneWidth, this.direction);
    this.setPosition(this.getValidPosition(position));
  }

  calculateMeasurements(done) {
    const updater = (state, props) => {
      const sceneWidth = size(this.els.element).width;
      const itemWidth = getItemWidth(global, sceneWidth, props);
      const listWidth = itemWidth * props.items.length;

      this.minPosition = Math.min(sceneWidth - listWidth, 0);
      return { sceneWidth, itemWidth, listWidth };
    };

    this.setState(updater, done);
  }

  nextSection() {
    let index = this.state.section + 1;
    if (index >= this.sectionsCount) index = 0;
    this.setSection(index);
  }

  prevSection() {
    let index = this.state.section - 1;
    if (index < 0) index = this.sectionsCount - 1;
    this.setSection(index);
  }

  handleResize() {
    if (!this.isComponentMounted) return;
    this.calculateMeasurements(this.snapToGrid);
  }

  handleDragStart(event) {
    this.startPosition = this.state.position;
    this.startX = eventCoordinates(event, 'pageX').pageX;
    this.stopAutoRotation();
  }

  handleDrag(event) {
    const diff = eventCoordinates(event, 'pageX').pageX - this.startX;
    const minPosition = this.minPosition - BOUNDARIES_EXCESS;
    const position = clamp(this.startPosition + diff, minPosition, BOUNDARIES_EXCESS);

    this.direction = this.startPosition - position;
    this.setPosition(position, { animated: false });

    if (Math.abs(diff) >= DISABLE_SCROLL_DISTANCE) event.preventDefault();
  }

  handleDragStop() {
    const diff = Math.abs(this.startPosition - this.state.position);

    if (diff >= SWIPE_TRIGGER_DISTANCE) {
      this.snapToGrid();
    } else {
      this.setPosition(this.startPosition);
    }

    this.startAutoRotation();
  }

  renderDots() {
    if (this.props.items.length <= 1) return null;

    return (
      <Dots
        count={this.sectionsCount}
        active={this.state.section}
        onItemClick={this.setSection}
      />
    );
  }

  renderItem(item) {
    return <li style={{ width: this.state.itemWidth }}>{item}</li>;
  }

  render() {
    const className = classNames('c-slideshow', this.props.className, { 'is-animated': this.state.isAnimated });
    const cleanProps = omit(this.props, 'items', 'visibleMobile', 'visibleTablet', 'visibleDesktop', 'rotationInterval');
    const { items } = this.props;

    const content = Children.map(items, this.renderItem);
    const draggableStyle = getPrefixed({ transform: `translateX(${this.state.position}px)` });

    this.sectionsCount = getSectionsCount(this.state.sceneWidth, this.state.listWidth);

    return (
      <article {...cleanProps} className={className} ref={this.setEl('element')}>
        <Draggable
          ref={this.setEl('draggable')}
          style={draggableStyle}
          className="c-slideshow-draggable"

          onDragStart={this.handleDragStart}
          onDrag={this.handleDrag}
          onDragStop={this.handleDragStop}
        >
          <ul className="c-slideshow-list">{content}</ul>
        </Draggable>
        {this.renderDots()}
      </article>
    );
  }
}

Slideshow.defaultProps = {
  visibleMobile: 1,
  visibleTablet: 2,
  visibleDesktop: 3,
};

Slideshow.propTypes = {
  className: PropTypes.string,

  items: PropTypes.array.isRequired,

  visibleMobile: PropTypes.number.isRequired,
  visibleTablet: PropTypes.number.isRequired,
  visibleDesktop: PropTypes.number.isRequired,

  rotationInterval: PropTypes.number,
};

export default Slideshow;
