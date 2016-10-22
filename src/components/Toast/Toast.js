/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import invariant from '../../utility/invariant';
import MODULE from './module';
import GATEWAY_CONTEXT_TYPES from '../Gateway/contextTypes';
import { contextKey } from '../Gateway/module';

export default class Toast extends Component {
  static module = MODULE;

  static contextTypes = GATEWAY_CONTEXT_TYPES;

  static defaultProps = {
    dismissable: false,
    duration: 5000,
  };

  static propTypes = {
    children: PropTypes.node,
    dismissable: PropTypes.bool,
    duration: PropTypes.number,
    gateName: PropTypes.string.isRequired,
  };

  /**
   * Validate that a toast is instantiated within a gateway.
   *
   * @param {Object} props
   * @param {Object} context
   */
  constructor(props, context) {
    super();

    invariant(typeof context[contextKey] !== 'undefined',
            'A `Toast` must be instantiated within a `Gateway`.');
  }

  /**
   * Set a timer to automatically remove the toast after a duration.
   */
  componentDidMount() {
    const { duration } = this.props;

    if (duration > 0) {
      setTimeout(this.hideToast, duration);
    }
  }

  /**
   * Conceal the toast by removing its element from the gateway.
   */
  @bind
  hideToast() {
    this.getContext(null, contextKey).warpOut(this.props.gateName, this.getInternalElement());
  }

  /**
   * Render the toast wrapper.
   *
   * @returns {ReactElement}
   */
  render() {
    const props = this.props;

    return (
      <div
        role="note"
        className={this.formatClass({
          'is-dismissable': props.dismissable,
        })}
        onClick={props.dismissable ? this.hideToast : null}
      >
        {props.children}
      </div>
    );
  }
}
