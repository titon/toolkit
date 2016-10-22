/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Tab from './Tab';
import childrenOf from '../../prop-types/childrenOf';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Nav extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: childrenOf(Tab),
  };

    /**
     * Render the tabs navigation list.
     *
     * @returns {ReactElement}
     */
  render() {
    const props = this.props;

    return (
      <nav
        id={this.formatID('tabs-nav')}
        className={this.formatChildClass('nav')}
        {...this.inheritNativeProps(props)}
      >
        <ol>
          {props.children}
        </ol>
      </nav>
        );
  }
}
