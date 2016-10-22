/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Next extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: PropTypes.node,
    onClick: collectionOf.func,
  };

    /**
     * Handles clicking the next button.
     *
     * @param {SyntheticEvent} e
     */
    @bind
  handleOnClick(e) {
    this.getContext().nextItem();
    this.handleEvent('click', e);
  }

    /**
     * Render a button that cycles to the next item.
     *
     * @returns {ReactElement}
     */
  render() {
    const props = this.props;

    return (
      <button
        type="button" role="button"
        className={this.formatChildClass('next')}
        onClick={this.handleOnClick}
        {...this.inheritNativeProps(props)}
      >
        {props.children}
      </button>
        );
  }
}
