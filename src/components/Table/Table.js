/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import childrenOf from '../../prop-types/childrenOf';
import MODULE from './module';

export default class Table extends Component {
  static module = MODULE;

  static defaultProps = {
    hoverable: false,
    sortable: false,
    striped: false,
  };

  static propTypes = {
    children: childrenOf('colgroup', 'thead', 'tbody', 'tfoot'),
    hoverable: PropTypes.bool,
    sortable: PropTypes.bool,
    striped: PropTypes.bool,
  };

  render() {
    const { children, hoverable, sortable, striped } = this.props;

    return (
      <div className={this.formatChildClass('responsive')}>
        <table
          className={this.formatClass({
            'has-hover': hoverable,
            'is-sortable': sortable,
            'is-striped': striped,
          })}
        >
          {children}
        </table>
      </div>
    );
  }
}
