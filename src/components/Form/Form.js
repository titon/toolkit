/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class Form extends Component {
  static module = MODULE;

  static defaultProps = {
    inline: false,
    method: 'get',
    multipart: false,
  };

  static propTypes = {
    action: PropTypes.string.isRequired,
    children: PropTypes.node,
    inline: PropTypes.bool,
    method: PropTypes.oneOf(['get', 'post', 'put']),
    multipart: PropTypes.bool,
  };

  /**
   * Render the form wrapper.
   *
   * @returns {ReactElement}
   */
  render() {
    let props = this.props,
      encType = props.multipart ? 'multipart/form-data' : 'application/x-www-form-urlencoded';

    return (
      <form
        action={props.action}
        method={props.method}
        encType={encType}
        className={this.formatClass({
          '@inline': props.inline,
        })}
      >
        {props.children}
      </form>
    );
  }
}
