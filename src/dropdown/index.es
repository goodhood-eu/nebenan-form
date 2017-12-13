import React from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';
import classNames from 'classnames';
import { has } from 'nebenan-helpers/lib/utils/data';
import { screenPosition, size, screenSize } from 'nebenan-helpers/lib/utils/dom';

import BaseComponent from 'nebenan-base-class/lib/base_component';
import ContextMenu from '../context_menu';
import ContextList from '../context_list';


const defaultGetOption = (key, items) => {
  const item = items[key];
  const className = classNames('c-dropdown-option', {
    'ui-link': item.href || item.callback,
  });

  return <span className={className}>{item.text}</span>;
};

class Dropdown extends BaseComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRight: false,
      isTop: false,
      isActive: false,
    };

    this.bindToComponent(
      'show',
      'hide',
      'handleShow',
      'handleHide',
      'handleSelect',
    );
  }

  getPosition(props) {
    let { positionRight: isRight, positionTop: isTop } = props;
    const hasRightPosition = has(props, 'positionRight');
    const hasTopPosition = has(props, 'positionTop');

    if (hasRightPosition && hasTopPosition) return { isRight, isTop };

    const { label } = this.els;
    const { top, left } = screenPosition(label);
    const { width, height } = size(label);
    const { width: sWidth, height: sHeight } = screenSize(global);

    if (!hasRightPosition) isRight = left + width < sWidth - left;
    if (!hasTopPosition) isTop = top + height > sHeight - top;

    return { isRight, isTop };
  }

  show() {
    this.els.menu.show();
  }

  hide() {
    this.els.menu.hide();
  }

  handleShow() {
    const { list } = this.els;
    if (list) list.activate();

    const updater = (state, props) => {
      const { isRight, isTop } = this.getPosition(props);
      return { isActive: true, isRight, isTop };
    };

    this.setState(updater, this.props.onShow);
  }

  handleHide() {
    const { list } = this.els;
    if (list) list.deactivate();
    this.setState({ isActive: false }, this.props.onHide);
  }

  handleSelect(key) {
    const { href, callback, preventClosing } = this.props.options[key];
    if (href) this.context.router.push(href);
    if (callback) callback(key);
    if (!preventClosing) this.hide();
  }

  renderList() {
    const getOption = this.props.getOption || defaultGetOption;
    const onSelect = this.props.onSelect || this.handleSelect;

    return (
      <ContextList
        ref={this.setEl('list')} className="ui-options"
        options={this.props.options} getOption={getOption}
        onSelect={onSelect}
      />
    );
  }

  renderLabel() {
    return (
      <span className="ui-link">
        {this.t('generic.more')} <i className="icon-arrow_down" />
      </span>
    );
  }

  renderCloseLabel() {
    const { closeLabel } = this.props;
    if (has(this.props, 'closeLabel') && !closeLabel) return null;

    let label = closeLabel;
    if (!label) {
      label = <small>{this.t('generic.close')} <i className="icon-cross" /></small>;
    }

    return <div className="c-dropdown-close ui-link" onClick={this.hide}>{label}</div>;
  }

  render() {
    const { isActive, isRight, isTop } = this.state;
    const { label, options, children } = this.props;

    const className = classNames('c-dropdown', this.props.className, {
      'is-right': isRight,
      'is-top': isTop,
    });

    const cleanProps = omit(
      this.props,
      'children',
      'options',
      'getOption',
      'onSelect',
      'closeLabel',
      'positionTop',
      'positionRight',
    );

    const menuLabel = (
      <span className="c-dropdown-label" ref={this.setEl('label')}>
        {label || this.renderLabel()}
      </span>
    );

    let menuBody;
    if (isActive) {
      let menuContent;
      if (children) menuContent = <div className="c-dropdown-content">{children}</div>;

      menuBody = (
        <div className="c-dropdown-body ui-card">
          {this.renderCloseLabel()}
          {options && this.renderList()}
          {menuContent}
        </div>
      );
    }

    return (
      <ContextMenu
        {...cleanProps}
        className={className} ref={this.setEl('menu')}
        label={menuLabel} onShow={this.handleShow} onHide={this.handleHide}
      >
        {menuBody}
      </ContextMenu>
    );
  }
}

Dropdown.contextTypes = {
  router: PropTypes.object,
  locale: PropTypes.object,
};

Dropdown.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,

  onShow: PropTypes.func,
  onHide: PropTypes.func,

  options: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
  getOption: PropTypes.func,
  onSelect: PropTypes.func,

  closeLabel: PropTypes.node,
  label: PropTypes.node,

  positionRight: PropTypes.bool,
  positionTop: PropTypes.bool,
};

export default Dropdown;
