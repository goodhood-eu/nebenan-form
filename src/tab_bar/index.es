import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';

const defaultGetItem = (index, items) => items[index].text;

class TabBar extends PureComponent {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  handleClick(key) {
    const item = this.props.items[key];
    if (item.href) this.context.router.push(item.href);
    if (item.callback) item.callback(key);
  }

  renderItem(item, key) {
    const { activeIndex, getItem, items } = this.props;
    const renderer = getItem || defaultGetItem;

    const className = classNames('c-tab_bar-item', {
      'is-active': key === activeIndex,
    });
    const onClick = this.handleClick.bind(this, key);
    const props = { key, className, onClick };

    return <li {...props}>{renderer(key, items)}</li>;
  }

  render() {
    const className = classNames('c-tab_bar', this.props.className);
    const cleanProps = omit(this.props, 'children', 'action', 'items', 'getItem', 'activeIndex');
    const { items, action, children } = this.props;

    let list;
    if (items) list = <ul className="c-tab_bar-list">{items.map(this.renderItem)}</ul>;

    let actionNode;
    if (action) actionNode = <span className="c-tab_bar-action">{action}</span>;


    let content;
    if (children) content = <span className="c-tab_bar-content">{children}</span>;

    return (
      <article {...cleanProps} className={className}>
        {actionNode}
        <div className="c-tab_bar-container">
          {list}
          {content}
        </div>
      </article>
    );
  }
}

TabBar.propTypes = {
  className: PropTypes.string,
  action: PropTypes.node,
  items: PropTypes.array,
  getItem: PropTypes.func,
  activeIndex: PropTypes.number,
  children: PropTypes.node,
};

TabBar.contextTypes = {
  router: PropTypes.object,
};

export default TabBar;
