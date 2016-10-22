/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Mask extends Component {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  state = {
    expanded: false,
  };

  /**
   * Define a context that is passed to all children.
   *
   * @returns {Object}
   */
  getChildContext() {
    return {
      [MODULE.contextKey]: {
        expanded: this.state.expanded,
        hideOverlay: this.hideOverlay,
        showOverlay: this.showOverlay,
        toggleOverlay: this.toggleOverlay,
        uid: this.getUID(),
      },
    };
  }

  /**
   * Only update if the `expanded` state changes.
   *
   * @param {Object} nextProps
   * @param {Object} nextState
   * @returns {Boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.expanded !== this.state.expanded);
  }

  /**
   * Conceal the overlay by marking it inactive.
   */
  @bind
  hideOverlay() {
    this.setState({
      expanded: false,
    });
  }

  /**
   * Reveal the overlay by marking it active.
   */
  @bind
  showOverlay() {
    this.setState({
      expanded: true,
    });
  }

  /**
   * Toggle the active state of the overlay.
   */
  @bind
  toggleOverlay() {
    if (this.state.expanded) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  }

  /**
   * Render the mask container.
   *
   * @returns {ReactElement}
   */
  render() {
    const props = this.props;

    return (
      <div
        id={this.formatID('mask')}
        className={this.formatClass()}
      >
        {props.children}
      </div>
    );
  }

}
