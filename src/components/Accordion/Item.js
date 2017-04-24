/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Section from './Section';
import emitEvent from '../../utility/emitEvent';
import style from '../../styler';
import { classNamesPropType, showHideDefaults, showHidePropTypes } from '../../propTypes';
import contextTypes from './contextTypes';

import type { AccordionContext, AccordionItemProps, AccordionItemState } from './types';

export class ToolkitAccordionItem extends React.Component {
  context: AccordionContext;
  props: AccordionItemProps;
  state: AccordionItemState;

  static contextTypes = {
    accordion: contextTypes.isRequired,
  };

  static propTypes = {
    ...showHidePropTypes,
    children: PropTypes.node.isRequired,
    classNames: classNamesPropType.isRequired,
    header: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    onClickHeader: PropTypes.func,
  };

  static defaultProps = {
    ...showHideDefaults,
    onClickHeader() {},
  };

  constructor({ index }: AccordionItemProps, { accordion }: AccordionContext) {
    super();

    this.state = {
      expanded: accordion.isItemActive(index),
    };
  }

  componentWillReceiveProps({ index }: AccordionItemProps, { accordion }: any) {
    this.setState({
      expanded: accordion.isItemActive(index),
    });
  }

  shouldComponentUpdate(nextProps: AccordionItemProps, { expanded }: AccordionItemState) {
    return (expanded !== this.state.expanded);
  }

  componentWillUpdate() {
    emitEvent(this, 'accordion', this.state.expanded ? 'onHiding' : 'onShowing');
  }

  componentDidUpdate() {
    emitEvent(this, 'accordion', this.state.expanded ? 'onShown' : 'onHidden');
  }

  render() {
    const { children, classNames, index, header, onClickHeader } = this.props;
    const { expanded } = this.state;

    return (
      <li>
        <Header
          index={index}
          active={expanded}
          onClick={onClickHeader}
          classNames={classNames}
        >
          {header}
        </Header>

        <Section
          index={index}
          expanded={expanded}
          classNames={classNames}
        >
          {children}
        </Section>
      </li>
    );
  }
}

export default style({
  header: 'accordion__header',
  header_link: 'accordion__header-link',
  header__active: 'is-active',
  section: 'accordion__section',
  section__expanded: 'is-expanded',
})(ToolkitAccordionItem);
