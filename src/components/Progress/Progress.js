/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Bar from './Bar';
import childrenOf from '../../prop-types/childrenOf';
import MODULE from './module';

export default class Progress extends Component {
  static module = MODULE;

  static defaultProps = {
    max: 100,
    min: 0,
    now: 0,
  };

  static propTypes = {
    children: childrenOf(Bar),
    max: PropTypes.number.isRequired,
    min: PropTypes.number.isRequired,
    now: PropTypes.number.isRequired,
  };

  /**
   * Render the progress bar.
   *
   * @returns {ReactElement}
   */
  render() {
    let { max, min, ...props } = this.props;

    return (
      <div
        role="progressbar"
        className={this.formatClass()}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={Math.min(Math.max(props.now, min), max)}
      >
        {props.children}
      </div>
    );
  }
}
