/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { showHidePropTypes } from '../../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Sidebar extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    ...showHidePropTypes,
    children: PropTypes.node,
    side: PropTypes.oneOf(['left', 'right']).isRequired,
  };

  /**
   * Verify the `expanded` state.
   *
   * @param {Object} props
   * @param {Object} context
   */
  constructor(props, context) {
    super();

    this.state = {
      expanded: this.getContext(context).isSidebarActive(props.side),
    };
  }

  /**
   * Determine whether the sidebar is expanded or not.
   *
   * @param {Object} nextProps
   * @param {Object} nextContext
   */
  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      expanded: this.getContext(nextContext).isSidebarActive(nextProps.side),
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
   * Render the off canvas sidebar.
   *
   * @returns {ReactElement}
   */
  render() {
    let props = this.props,
      expanded = this.state.expanded;

    return (
      <aside
        role="complementary"
        className={this.formatChildClass('sidebar', {
          [`@${props.side}`]: true,
          'is-expanded': expanded,
        })}
        aria-hidden={!expanded}
        aria-expanded={expanded}
        data-offcanvas-sidebar={props.side}
      >
        {props.children}
      </aside>
    );
  }
}
