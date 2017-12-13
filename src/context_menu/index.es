import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';

import keymanager from 'nebenan-helpers/lib/keymanager';

import BaseComponent from 'nebenan-base-class/lib/base_component';


class ContextMenu extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { isActive: false };
    this.bindToComponent(
      'handleGlobalClick',
      'hide',
      'show',
      'toggle',
    );
  }

  activate() {
    if (this.isListenerActive) return;
    this.stopListeningToKeys = keymanager('esc', this.hide);
    document.addEventListener('click', this.handleGlobalClick);
    this.isListenerActive = true;
  }

  deactivate() {
    if (!this.isListenerActive) return;
    this.stopListeningToKeys();
    document.removeEventListener('click', this.handleGlobalClick);
    this.isListenerActive = false;
  }

  componentDidMount() {
    if (this.props.defaultState) this.show();
  }

  componentWillUnmount() {
    this.deactivate();
  }

  handleGlobalClick(event) {
    // click registered before rendering/after unmounting was complete
    if (!this.els.container) return;
    if (!this.els.container.contains(event.target)) this.hide();
  }

  hide() {
    this.deactivate();
    if (this.isActive()) this.setState({ isActive: false }, this.props.onHide);
  }

  show() {
    this.activate();
    if (!this.isActive()) this.setState({ isActive: true }, this.props.onShow);
  }

  toggle() {
    if (this.isActive()) return this.hide();
    this.show();
  }

  isActive() {
    return this.state.isActive;
  }

  render() {
    const className = classNames('c-context_menu', this.props.className, {
      'is-active': this.state.isActive,
    });

    const cleanProps = omit(this.props, 'children', 'label', 'defaultState', 'onHide', 'onShow');
    const label = (
      <header className="c-context_menu-label" onClick={this.toggle}>
        {this.props.label}
      </header>
    );

    return (
      <aside {...cleanProps} className={className} ref={this.setEl('container')}>
        {label}
        {this.props.children}
      </aside>
    );
  }
}

ContextMenu.propTypes = {
  className: PropTypes.string,
  label: PropTypes.node,
  defaultState: PropTypes.bool,
  onHide: PropTypes.func,
  onShow: PropTypes.func,
  children: PropTypes.node,
};

export default ContextMenu;
