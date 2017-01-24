/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Tab from './Tab';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class TabList extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    onClick: collectionOf.func,
  };

  render() {
    const children = [];
    const { onClick } = this.props;

    for (let i = 0; i < this.getContext().itemCount; i += 1) {
      children.push(
        <Tab
          index={i}
          key={`tab-${i}`}
          onClick={onClick}
        />,
      );
    }

    return (
      <nav className={this.formatChildClass('tab-list')}>
        <ol>
          {children}
        </ol>
      </nav>
    );
  }
}
