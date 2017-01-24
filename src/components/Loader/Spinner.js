/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Message from './Message';
import childrenOf from '../../prop-types/childrenOf';
import MODULE from './module';

export default class Spinner extends Component {
  static module = MODULE;

  static defaultProps = {
    type: 'bubble',
  };

  static propTypes = {
    children: childrenOf(Message),
    type: PropTypes.oneOf(['bubble']),
  };

  render() {
    const { children, type } = this.props;
    const spinners = [];

    for (let i = 0; i < 8; i += 1) {
      spinners.push(<span key={i} />);
    }

    return (
      <div
        className={this.formatClass({
          [`@${type}-spinner`]: true,
        })}
      >
        <div className={this.formatChildClass('spinner')}>
          {spinners}
        </div>

        {children}
      </div>
    );
  }
}
