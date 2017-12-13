import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import BaseComponent from 'nebenan-base-class/lib/base_component';


class Draggable extends BaseComponent {
  constructor(props) {
    super(props);

    this.bindToComponent(
      'handleTouchStart',
      'handleMouseDown',
      'handleMove',
      'handleStop',
    );
  }

  componentWillUnmount() {
    this.deactivateMouse();
    this.deactivateTouch();
  }

  getNode() {
    return this.els.node;
  }

  activateMouse() {
    if (this.isMouseActive) return;
    document.addEventListener('mousemove', this.handleMove);
    document.addEventListener('mouseup', this.handleStop);
    this.isMouseActive = true;
  }

  deactivateMouse() {
    if (!this.isMouseActive) return;
    document.removeEventListener('mousemove', this.handleMove);
    document.removeEventListener('mouseup', this.handleStop);
    this.isMouseActive = false;
  }

  activateTouch() {
    if (this.isTouchActive) return;
    document.addEventListener('touchmove', this.handleMove);
    document.addEventListener('touchend', this.handleStop);
    this.isTouchActive = true;
  }

  deactivateTouch() {
    if (!this.isTouchActive) return;
    document.removeEventListener('touchmove', this.handleMove);
    document.removeEventListener('touchend', this.handleStop);
    this.isTouchActive = false;
  }

  handleTouchStart(event) {
    this.activateTouch();
    if (this.props.onTouchStart) this.props.onTouchStart(event);
    if (this.props.onDragStart) this.props.onDragStart(event);
  }

  handleMouseDown(event) {
    this.activateMouse();
    if (this.props.onMouseDown) this.props.onMouseDown(event);
    if (this.props.onDragStart) this.props.onDragStart(event);
  }

  handleMove(event) {
    if (this.props.onDrag) this.props.onDrag(event);
  }

  handleStop(event) {
    this.deactivateTouch();
    this.deactivateMouse();
    if (this.props.onDragStop) this.props.onDragStop(event);
  }

  render() {
    const cleanProps = omit(this.props, 'onDragStart', 'onDrag', 'onDragStop');

    return (
      <div
        {...cleanProps}
        ref={this.setEl('node')}
        onTouchStart={this.handleTouchStart}
        onMouseDown={this.handleMouseDown}
      />
    );
  }
}

Draggable.propTypes = {
  onDragStart: PropTypes.func.isRequired,
  onDrag: PropTypes.func.isRequired,
  onDragStop: PropTypes.func.isRequired,
};

export default Draggable;
