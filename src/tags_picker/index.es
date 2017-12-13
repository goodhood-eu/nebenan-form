import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import omit from 'lodash/omit';

import { arrayToHash } from 'nebenan-helpers/lib/utils/data';

import InputProxyComponent from 'nebenan-base-class/lib/input_proxy_component';
import TagCloud from '../tag_cloud';
import TagInput from '../tag_input';


class TagsPicker extends InputProxyComponent {
  constructor(props) {
    super(props);
    this.bindToComponent(
      'handleSelect',
    );
  }

  handleSelect(tag) {
    if (this.itemsHash[tag]) return;

    this.props.onSelect(tag);
    this.els.tagInput.reset();
  }

  render() {
    const className = classNames('c-tags_picker', this.props.className);
    const cleanProps = omit(this.props,
      'children',

      'placeholder',
      'options',
      'items',

      'onSelect',
    );

    const { options, items, placeholder, children } = this.props;
    this.itemsHash = arrayToHash(items);

    return (
      <TagCloud {...cleanProps} ref={this.setEl('input')} items={items} className={className}>
        <TagInput
          ref={this.setEl('tagInput')}
          placeholder={placeholder}
          options={options}
          onSelect={this.handleSelect}
        />
        {children}
      </TagCloud>
    );
  }
}

TagsPicker.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,

  placeholder: PropTypes.string,
  options: PropTypes.array,
  items: PropTypes.array,

  onSelect: PropTypes.func.isRequired,
};

export default TagsPicker;
