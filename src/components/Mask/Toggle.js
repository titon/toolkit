/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Toggle extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: PropTypes.node,
  };

  @bind
  handleOnClick() {
    this.getContext().toggleOverlay();
  }

  render() {
    return this.transferToChild(this.props.children, {
      className: this.getContext().expanded ? 'is-active' : '',
      onClick: this.handleOnClick,
    });
  }
}
