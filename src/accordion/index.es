import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';


class Accordion extends PureComponent {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  handleClick(index) {
    const newIndex = index === this.props.activeIndex ? null : index;
    this.props.onChange(newIndex);
  }

  renderItem(item, index) {
    const isActive = index === this.props.activeIndex;
    const className = classNames('c-accordion-item', { 'is-active': isActive });
    const iconClassname = classNames({ 'icon-arrow_down': !isActive, 'icon-arrow_up': isActive });

    let content;
    if (isActive) content = <div className="c-accordion-item-content">{item.content}</div>;

    return (
      <li key={item.title} className={className}>
        <div className="c-accordion-item-title" onClick={this.handleClick.bind(this, index)}>
          <i className={iconClassname} /> {item.title}
        </div>
        {content}
      </li>
    );
  }

  render() {
    const className = classNames('c-accordion', this.props.className);
    const cleanProps = omit(this.props, 'activeIndex', 'items', 'onChange');

    return <ul {...cleanProps} className={className}>{this.props.items.map(this.renderItem)}</ul>;
  }
}

Accordion.defaultProps = {
  activeIndex: 0,
};

Accordion.propTypes = {
  className: PropTypes.string,
  activeIndex: PropTypes.number,

  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,

  onChange: PropTypes.func.isRequired,
};

export default Accordion;
