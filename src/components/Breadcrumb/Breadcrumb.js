/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import childrenOf from '../../prop-types/childrenOf';
import MODULE from './module';

export default class Breadcrumb extends Component {
  static module = MODULE;

  static defaultProps = {
    label: 'Navigation',
  };

  static propTypes = {
    children: childrenOf(Item),
    label: PropTypes.string,
  };

  render() {
    const props = this.props;

    return (
      <nav
        role="navigation"
        id={this.formatID('breadcrumb')}
        className={this.formatClass()}
        aria-label={props.label}
      >
        <ol>
          {props.children}
        </ol>
      </nav>
    );
  }
}
