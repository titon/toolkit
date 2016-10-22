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

export default class Spinner extends Component {
  static module = MODULE;

  static defaultProps = {
    type: 'bubble',
  };

  static propTypes = {
    children: childrenOf(Message),
    type: PropTypes.oneOf(['bubble']),
  };

    /**
     * Render the spinner loader and generate a count of spinners.
     *
     * @returns {ReactElement}
     */
  render() {
    let props = this.props,
      spinners = [];

    for (let i = 0; i < 8; i++) {
      spinners.push(<span key={i} />);
    }

    return (
      <div
        className={this.formatClass({
          [`@${props.type}-spinner`]: true,
        })}
        {...this.inheritNativeProps(props)}
      >
        <div className={this.formatChildClass('spinner')}>
          {spinners}
        </div>

        {props.children}
      </div>
        );
  }
}
