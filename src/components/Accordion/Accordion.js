/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React, { Children, PropTypes } from 'react';
import { childrenOfType } from 'airbnb-prop-types';
import Item from './Item';
import collectionOf from '../../prop-types/collectionOf';
import generateUID from '../../utility/generateUID';
import formatID from '../../utility/formatID';
import style, { classes } from '../../styler';
import { classNamesPropType } from '../../propTypes';
import contextTypes from './contextTypes';

import type { AccordionContext, AccordionProps, AccordionState } from './types';

export class ToolkitAccordion extends React.Component {
  context: AccordionContext;
  props: AccordionProps;

  static childContextTypes = {
    accordion: contextTypes.isRequired,
  };

  static propTypes = {
    children: childrenOfType(Item).isRequired,
    classNames: classNamesPropType.isRequired,
    collapsible: PropTypes.bool,
    defaultIndex: collectionOf.number,
    multiple: PropTypes.bool,
  };

  static defaultProps = {
    collapsible: false,
    defaultIndex: 0,
    multiple: false,
  };

  state: AccordionState = {
    indices: new Set(),
  };

  uid: string = generateUID();

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

  shouldComponentUpdate(nextProps: AccordionProps, nextState: AccordionState): boolean {
    return (nextProps.multiple || nextState.indices !== this.state.indices);
  }

  hideItem = (index: number) => {
    const indices = new Set(this.state.indices);

    (Array.isArray(index) ? index : [index]).forEach(i => indices.delete(i));

    this.setState({
      indices,
    });
  };

  isItemCollapsible = (index: number) => (
    (this.props.multiple || this.props.collapsible) && this.isItemActive(index)
  );

  isItemActive = (index: number) => this.state.indices.has(index);

  showItem = (index: number) => {
    const { children, multiple } = this.props;
    const total = Children.count(children);
    const indices = new Set(multiple ? this.state.indices : []);
    const newIndices = [];

    if (Array.isArray(index)) {
      if (!multiple) {
        newIndices.push(index[0]);
      } else {
        newIndices.push(...index);
      }
    } else {
      newIndices.push(index);
    }

    newIndices.forEach((i) => {
      if (i >= 0 && i < total) {
        indices.add(i);
      }
    });

    this.setState({
      indices,
    });
  };

  toggleItem = (index: number) => {
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
