/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Start extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: PropTypes.node,
    onClick: collectionOf.func,
  };

  @bind
  handleOnClick(e) {
    this.getContext().startCycle();
    this.handleEvent('click', e);
  }

  render() {
    const props = this.props;

    return (
      <button
        type="button"
        role="button"
        className={this.formatChildClass('start')}
        onClick={this.handleOnClick}
      >
        {props.children}
      </button>
    );
  }
}
