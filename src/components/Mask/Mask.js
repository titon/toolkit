/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import generateUID from '../../utility/generateUID';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Mask extends Component {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: PropTypes.node,
  };

  state = {
    expanded: false,
  };

  uid = generateUID();

  getChildContext() {
    return {
      [MODULE.contextKey]: {
        expanded: this.state.expanded,
        hideOverlay: this.hideOverlay,
        showOverlay: this.showOverlay,
        toggleOverlay: this.toggleOverlay,
        uid: this.uid,
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.expanded !== this.state.expanded);
  }

  @bind
  hideOverlay() {
    this.setState({
      expanded: false,
    });
  }

  @bind
  showOverlay() {
    this.setState({
      expanded: true,
    });
  }

  @bind
  toggleOverlay() {
    if (this.state.expanded) {
      this.hideOverlay();
    } else {
      this.showOverlay();
    }
  }

  render() {
    return (
      <div
        id={this.formatID('mask')}
        className={this.formatClass()}
      >
        {this.props.children}
      </div>
    );
  }

}
