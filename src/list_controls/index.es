import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import InteractiveComponent from 'nebenan-base-class/lib/interactive_component';

import { getValue, getOptions, getSignature } from './utils';

import Dropdown from '../dropdown';
import ContextMenu from '../context_menu';
import Input from '../input';

const SEARCH_CHANGE_RATE = 300;


class ListControls extends InteractiveComponent {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState(props);
    this.bindToComponent(
      'handleReset',
      'handleDropdownToggle',
      'handleSearchChange',
      'handleSelect',
      'handleDeactivateSearch',
      'handleSearchShow',
    );
  }

  getDefaultState(props) {
    const value = getValue(props.defaultValue);
    const signature = getSignature(value);
    const hasDropdown = false;
    return { value, signature, hasDropdown };
  }

  getSignature() {
    return this.state.signature;
  }

  getValue() {
    return this.state.value;
  }

  setValue(value, done, options = {}) {
    const signature = getSignature(value);

    const updater = (state) => {
      if (state.signature !== signature) return { value, signature };
      if (done) done();
      return null;
    };

    const complete = () => {
      if (this.props.onUpdate && !options.silent) this.props.onUpdate(value);
      if (done) done();
    };

    this.setState(updater, complete);
  }

  handleReset() {
    const updater = (state, props) => this.getDefaultState(props);
    const complete = () => {
      this.els.input.reset();
      if (this.props.onUpdate) this.props.onUpdate(this.getValue());
    };

    this.setState(updater, complete);
  }

  handleDropdownToggle() {
    this.setState((state) => ({ hasDropdown: !state.hasDropdown }));
  }

  handleSearchChange() {
    if (!this.isComponentMounted) return false;

    const search = this.els.input.getValue();
    const value = { ...this.state.value, search };
    const delayed = () => this.setValue(value);

    // Fixes race condition with input onChange. Will be fixed after React upgrade
    process.nextTick(delayed);
    return true;
  }

  handleSelect(type, index) {
    const item = this.props[`${type}Options`][index];
    const value = { ...this.state.value, ...{ [type]: item.value } };
    this.setValue(value);
  }

  handleDeactivateSearch() {
    this.els.search.hide();
  }

  handleSearchShow() {
    this.els.input.focus();
  }

  getDropdownOption(type, key, items) {
    const item = items[key];
    const isActive = item.value === this.state.value[type];
    const className = classNames('c-list_controls-option ui-link', {
      'is-active': isActive,
    });
    return <span className={className}>{item.key}</span>;
  }

  renderSearch() {
    const className = classNames('c-list_controls-icon', {
      'is-active': this.state.value.search,
    });
    const label = <span className={className}><i className="icon-magnifier" /></span>;

    return (
      <ContextMenu
        ref={this.setEl('search')}
        className="c-list_controls-search c-list_controls-item"
        onShow={this.handleSearchShow}
        label={label}
      >
        <div className="c-list_controls-search_form">
          <span
            className="c-list_controls-icon"
            onClick={this.handleDeactivateSearch}
          >
            <i className="icon-magnifier" />
          </span>

          <Input
            ref={this.setEl('input')} type="search"
            onUpdate={debounce(this.handleSearchChange, SEARCH_CHANGE_RATE)}
            onEnterKey={this.handleDeactivateSearch}
            placeholder={this.t('input.placeholder_search')}
          />
        </div>
      </ContextMenu>
    );
  }

  renderFilter() {
    const className = classNames('c-list_controls-icon', {
      'is-active': this.state.value.filter,
    });
    const label = <span className={className}><i className="icon-funnel" /></span>;

    return (
      <Dropdown
        className="c-list_controls-item"
        label={label}
        closeLabel={false}
        options={getOptions('filter', this.props.filterOptions, this.handleSelect)}
        getOption={this.getDropdownOption.bind(this, 'filter')}
        onShow={this.handleDropdownToggle} onHide={this.handleDropdownToggle}
      />
    );
  }

  renderSort() {
    const className = classNames('c-list_controls-icon', {
      'is-active': this.state.value.sort,
    });
    const label = <span className={className}><i className="icon-list_sorting" /></span>;

    return (
      <Dropdown
        className="c-list_controls-item"
        label={label}
        closeLabel={false}
        options={getOptions('sort', this.props.sortOptions, this.handleSelect)}
        getOption={this.getDropdownOption.bind(this, 'sort')}
        onShow={this.handleDropdownToggle} onHide={this.handleDropdownToggle}
      />
    );
  }

  render() {
    const className = classNames('c-list_controls ui-card', this.props.className, {
      'has-dropdown': this.state.hasDropdown,
    });

    const defaultState = this.getDefaultState(this.props);

    let resetLabel;
    if (defaultState.signature !== this.state.signature) {
      resetLabel = (
        <span className="c-list_controls-reset ui-link" onClick={this.handleReset}>
          <small>{this.t('list_controls.reset')}</small>
          <i className="icon-cross" />
        </span>
      );
    }

    return (
      <article className={className}>
        {this.renderSearch()}
        {this.renderFilter()}
        {this.renderSort()}
        {resetLabel}
        {this.props.children}
      </article>
    );
  }
}

ListControls.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,

  defaultValue: PropTypes.object,
  onUpdate: PropTypes.func,

  filterOptions: PropTypes.array.isRequired,
  sortOptions: PropTypes.array.isRequired,
};

export default ListControls;
