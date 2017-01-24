/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Divider from './Divider';
import Header from './Header';
import Item from './Item';
import childrenOf from '../../prop-types/childrenOf';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Menu extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static defaultProps = {
    direction: 'down',
    nested: false,
    reverse: false,
  };

  static propTypes = {
    children: childrenOf(Divider, Header, Item),
    direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
    nested: PropTypes.bool,
    reverse: PropTypes.bool,
  };

  render() {
    const { children, direction, nested, reverse } = this.props;
    const { expanded } = this.getContext();

    return (
      <div
        role="menu"
        id={nested ? null : this.formatID('drop-menu')}
        className={this.formatClass({
          '@down': (direction === 'down'),
          '@left': (direction === 'left'),
          '@right': (direction === 'right'),
          '@up': (direction === 'up'),
          'is-branch': nested,
          'is-expanded': (!nested && expanded),
          'is-root': !nested,
          'reverse-align': reverse,
        })}
      >
        <ul>
          {children}
        </ul>
      </div>
    );
  }
}
