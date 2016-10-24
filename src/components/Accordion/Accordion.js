/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import bind from '../../decorators/bind';
import childrenOf from '../../prop-types/childrenOf';
import collectionOf from '../../prop-types/collectionOf';
import generateUID from '../../utility/generateUID';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Accordion extends Component {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  static defaultProps = {
    collapsible: false,
    defaultIndex: 0,
    multiple: false,
  };

  static propTypes = {
    children: childrenOf(Item),
    collapsible: PropTypes.bool,
    defaultIndex: collectionOf.number,
    multiple: PropTypes.bool,
  };

  state = {
    indices: new Set(),
  };

  uid = generateUID();

  getChildContext() {
    return {
      [MODULE.contextKey]: {
        activeIndices: Array.from(this.state.indices),
        hideItem: this.hideItem,
        isItemActive: this.isItemActive,
        isItemCollapsible: this.isItemCollapsible,
        showItem: this.showItem,
        toggleItem: this.toggleItem,
        uid: this.uid,
      },
    };
  }

  componentWillMount() {
    this.showItem(this.props.defaultIndex);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.multiple || nextState.indices !== this.state.indices);
  }

  @bind
  hideItem(index) {
    const indices = new Set(this.state.indices);

    if (!Array.isArray(index)) {
      index = [index];
    }

    index.forEach(i => indices.delete(i));

    this.setState({
      indices,
    });
  }

  @bind
  isItemCollapsible(index) {
    return ((this.props.multiple || this.props.collapsible) && this.isItemActive(index));
  }

  @bind
  isItemActive(index) {
    return (this.state.indices.has(index));
  }

  @bind
  showItem(index) {
    const multiple = this.props.multiple;
    const indices = new Set(multiple ? this.state.indices : []);
    const total = Children.count(this.props.children);

    if (Array.isArray(index)) {
      if (!multiple) {
        index = [index[0]];
      }
    } else {
      index = [index];
    }

    index.forEach((i) => {
      if (i >= 0 && i < total) {
        indices.add(i);
      }
    });

    this.setState({
      indices,
    });
  }

  @bind
  toggleItem(index) {
    if (this.isItemCollapsible(index)) {
      this.hideItem(index);
    } else {
      this.showItem(index);
    }
  }

  render() {
    const { children, collapsible, multiple } = this.props;

    return (
      <ul
        role="tablist"
        id={this.formatID('accordion')}
        className={this.formatClass({
          'is-collapsible': collapsible,
          'is-multiple': multiple,
        })}
        aria-live="off"
      >
        {children}
      </ul>
    );
  }
}
