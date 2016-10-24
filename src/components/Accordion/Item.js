/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Header from './Header';
import Section from './Section';
import collectionOf from '../../prop-types/collectionOf';
import emitEvent from '../../utility/emitEvent';
import { showHidePropTypes } from '../../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Item extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    ...showHidePropTypes,
    children: PropTypes.node,
    header: PropTypes.node.isRequired,
    index: PropTypes.number.isRequired,
    onClickHeader: collectionOf.func,
  };

  constructor(props, context) {
    super();

    this.state = {
      expanded: this.getContext(context).isItemActive(props.index),
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      expanded: this.getContext(nextContext).isItemActive(nextProps.index),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.expanded !== this.state.expanded);
  }

  componentWillUpdate() {
    emitEvent(this, this.state.expanded ? 'onHiding' : 'onShowing');
  }

  componentDidUpdate() {
    emitEvent(this, this.state.expanded ? 'onShown' : 'onHidden');
  }

  render() {
    const { children, index, header, onClickHeader } = this.props;
    const { expanded } = this.state;

    return (
      <li>
        <Header
          role="tab"
          index={index}
          active={expanded}
          onClick={onClickHeader}
        >
          {header}
        </Header>

        <Section
          index={index}
          expanded={expanded}
        >
          {children}
        </Section>
      </li>
    );
  }
}
