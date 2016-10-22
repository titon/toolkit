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

  /**
   * Setup the state.
   *
   * @param {Object} props
   * @param {Object} context
   */
  constructor(props, context) {
    super();

    this.state = {
      expanded: this.getContext(context).isItemActive(props.index),
    };
  }

  /**
   * Determine whether the section is expanded or not.
   *
   * @param {Object} nextProps
   * @param {Object} nextContext
   */
  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      expanded: this.getContext(nextContext).isItemActive(nextProps.index),
    });
  }

  /**
   * Only update if the expanded state is different.
   *
   * @param {Object} nextProps
   * @param {Object} nextState
   * @returns {Boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.expanded !== this.state.expanded);
  }

  /**
   * Emit `showing` or `hiding` events before rendering.
   */
  componentWillUpdate() {
    this.emitEvent(this.state.expanded ? 'hiding' : 'showing');
  }

  /**
   * Emit `shown` or `hidden` events after rendering.
   */
  componentDidUpdate() {
    this.emitEvent(this.state.expanded ? 'shown' : 'hidden');
  }

  /**
   * Render the accordion item and pass all relevant props to the sub-children.
   *
   * @returns {ReactElement}
   */
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
