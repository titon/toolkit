/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Message from './Message';
import childrenOf from '../../prop-types/childrenOf';
import MODULE from './module';

export default class Wave extends Component {
  static module = MODULE;

  static defaultProps = {
    count: 5,
    type: 'bar',
  };

  static propTypes = {
    children: childrenOf(Message),
    count: PropTypes.number,
    type: PropTypes.oneOf(['bar', 'bubble']),
  };

  /**
   * Render the wave loader and generate a count of waves.
   *
   * @returns {ReactElement}
   */
  render() {
    const { children, type, count } = this.props;
    const waves = [];

    for (let i = 0; i < count; i += 1) {
      waves.push(<span key={i} />);
    }

    return (
      <div
        className={this.formatClass({
          [`@${type}-wave`]: true,
        })}
      >
        {waves}
        {children}
      </div>
    );
  }
}
