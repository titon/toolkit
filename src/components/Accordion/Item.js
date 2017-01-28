/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Header from './Header';
import Section from './Section';
import emitEvent from '../../utility/emitEvent';
import style from '../../styler';
import { classNamesPropType, showHideDefaults, showHidePropTypes } from '../../propTypes';
import contextTypes from './contextTypes';

export class ToolkitAccordionItem extends React.Component {
  static contextTypes = {
    accordion: contextTypes.isRequired,
  };

  static propTypes = {
    ...showHidePropTypes,
    children: PropTypes.node,
    classNames: classNamesPropType,
    header: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    onClickHeader: PropTypes.func,
  };

  static defaultProps = {
    ...showHideDefaults,
    onClickHeader() {},
  };

  constructor({ index }, { accordion }) {
    super();

    this.state = {
      expanded: accordion.isItemActive(index),
    };
  }

  componentWillReceiveProps({ index }, { accordion }) {
    this.setState({
      expanded: accordion.isItemActive(index),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.expanded !== this.state.expanded);
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
