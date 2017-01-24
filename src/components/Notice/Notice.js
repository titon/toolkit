/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import { states } from '../../propTypes';
import MODULE from './module';

export default class Notice extends Component {
  static module = MODULE;

  static defaultProps = {
    close: <span className="x" />,
    dismissable: false,
  };

  static propTypes = {
    children: PropTypes.node,
    close: PropTypes.node,
    dismissable: PropTypes.bool,
    state: states,
    title: PropTypes.node,
  };

  state = {
    dismissed: false,
  };

  @bind
  handleOnClick() {
    this.setState({
      dismissed: true,
    });
  }

  render() {
    const { children, state, dismissable, title, close } = this.props;
    const role = ['warn', 'warning', 'error', 'danger', 'failure', 'critical']
      .includes(state) ? 'alert' : 'notice';

    // Remove the element entirely when dismissing
    if (this.state.dismissed) {
      return null;
    }

    return (
      <div
        role={role}
        className={this.formatClass({
          [`@${state}`]: state,
          'is-dismissable': dismissable,
        })}
      >
        {dismissable && (
          <button
            type="button"
            role="button"
            className={this.formatChildClass('close')}
            onClick={this.handleOnClick}
          >
            {close}
          </button>
        )}

        {title && (
          <div className={this.formatChildClass('head')}>
            {title}
          </div>
        )}

        <div className={this.formatChildClass('body')}>
          {children}
        </div>
      </div>
    );
  }
}
