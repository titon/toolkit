/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Item from './Item';
import childrenOf from '../../prop-types/childrenOf';
import collectionOf from '../../prop-types/collectionOf';
import generateUID from '../../utility/generateUID';
import formatID from '../../utility/formatID';
import style, { classes } from '../../styler';
import { classNamesPropType } from '../../propTypes';
import contextTypes from './contextTypes';

export class ToolkitAccordion extends React.Component {
  static childContextTypes = {
    accordion: contextTypes.isRequired,
  };

  static propTypes = {
    children: childrenOf(Item),
    classNames: classNamesPropType,
    collapsible: PropTypes.bool,
    defaultIndex: collectionOf.number,
    multiple: PropTypes.bool,
  };

  static defaultProps = {
    collapsible: false,
    defaultIndex: 0,
    multiple: false,
  };

  state = {
    indices: new Set(),
  };

  uid = generateUID();

  getChildContext() {
    return {
      accordion: {
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

  hideItem = (index) => {
    const indices = new Set(this.state.indices);

    (Array.isArray(index) ? index : [index])
      .forEach(i => indices.delete(i));

    this.setState({
      indices,
    });
  };

  isItemCollapsible = index => (
    (this.props.multiple || this.props.collapsible) && this.isItemActive(index)
  );

  isItemActive = index => this.state.indices.has(index);

  showItem = (index) => {
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
  };

  toggleItem = (index) => {
    if (this.isItemCollapsible(index)) {
      this.hideItem(index);
    } else {
      this.showItem(index);
    }
  };

  render() {
    const { children, classNames, collapsible, multiple } = this.props;

    return (
      <ul
        role="tablist"
        id={formatID('accordion', this.uid)}
        className={classes(classNames.accordion, {
          [classNames.accordion__collapsible]: collapsible,
          [classNames.accordion__multiple]: multiple,
        })}
        aria-live="off"
      >
        {children}
      </ul>
    );
  }
}

export default style({
  accordion: 'accordion',
  accordion__collapsible: 'is-collapsible',
  accordion__multiple: 'is-multiple',
})(ToolkitAccordion);
