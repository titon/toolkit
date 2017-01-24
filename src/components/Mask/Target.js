/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Target extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    expanded: false,
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      expanded: this.getContext(nextContext).expanded,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.expanded !== this.state.expanded);
  }

  render() {
    const { expanded } = this.state;

    return (
      <div
        id={this.formatID('mask-target')}
        className={this.formatChildClass('target', {
          'is-masked': expanded,
        })}
        aria-controls={this.formatID('mask-overlay')}
        aria-expanded={expanded}
      >
        {this.props.children}
      </div>
    );
  }

}
