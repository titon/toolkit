/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import emitEvent from '../../utility/emitEvent';
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

  constructor(props, context) {
    super();

    this.state = {
      expanded: this.getContext(context).isSidebarActive(props.side),
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      expanded: this.getContext(nextContext).isSidebarActive(nextProps.side),
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
    const { children, side } = this.props;
    const { expanded } = this.state;

    return (
      <aside
        role="complementary"
        className={this.formatChildClass('sidebar', {
          [`@${side}`]: true,
          'is-expanded': expanded,
        })}
        aria-hidden={!expanded}
        aria-expanded={expanded}
        data-offcanvas-sidebar={side}
      >
        {children}
      </aside>
    );
  }
}
