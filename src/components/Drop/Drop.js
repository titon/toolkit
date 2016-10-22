/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Menu from './Menu';
import Toggle from './Toggle';
import bind from '../../decorators/bind';
import childrenOf from '../../prop-types/childrenOf';
import isOutsideElement from '../../utility/isOutsideElement';
import generateUID from '../../utility/generateUID';
import emitEvent from '../../utility/emitEvent';
import { showHidePropTypes } from '../../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Drop extends Component {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  static propTypes = {
    ...showHidePropTypes,
    children: childrenOf(Menu, Toggle),
  };

  state = {
    expanded: false,
  };

  uid = generateUID();

  /**
   * Define a context that is passed to all children.
   *
   * @returns {Object}
   */
  getChildContext() {
    return {
      [MODULE.contextKey]: {
        expanded: this.state.expanded,
        hideMenu: this.hideMenu,
        showMenu: this.showMenu,
        toggleMenu: this.toggleMenu,
        uid: this.uid,
      },
    };
  }

  /**
   * Bind handlers before mounting.
   */
  componentWillMount() {
    window.addEventListener('click', this.handleOnClickOut);
  }

  /**
   * Only update if the `expanded` state is different.
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
    emitEvent(this, this.state.expanded ? 'onHiding' : 'onShowing');
  }

  /**
   * Emit `shown` or `hidden` events after rendering.
   */
  componentDidUpdate() {
    emitEvent(this, this.state.expanded ? 'onShown' : 'onHidden');
  }

  /**
   * Unbind handlers when unmounting.
   */
  componentWillUnmount() {
    window.removeEventListener('click', this.handleOnClickOut);
  }

  /**
   * When a click occurs outside the drop container, and the menu is open,
   * automatically hide the menu.
   *
   * @param {Event} e
   */
  @bind
  handleOnClickOut(e) {
    if (this.state.expanded && isOutsideElement(this.container, e.target)) {
      this.hideMenu();
    }
  }

  /**
   * Hide the menu by setting the state to closed.
   */
  @bind
  hideMenu() {
    this.setState({
      expanded: false,
    });
  }

  /**
   * Show the menu by setting the state to opened.
   */
  @bind
  showMenu() {
    this.setState({
      expanded: true,
    });
  }

  /**
   * Toggle the open state of the menu.
   */
  @bind
  toggleMenu() {
    if (this.state.expanded) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  }

  /**
   * Render the drop container.
   *
   * @returns {ReactElement}
   */
  render() {
    return (
      <div id={this.formatID('drop')} ref={(ref) => { this.container = ref; }}>
        {this.props.children}
      </div>
    );
  }
}
