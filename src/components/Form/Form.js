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

  static default= {
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

  render() {
    const { children, action, method, inline, multipart } = this.props;
    const encType = multipart ? 'multipart/form-data' : 'application/x-www-form-urlencoded';

    return (
      <form
        action={action}
        method={method}
        encType={encType}
        className={this.formatClass({
          '@inline': inline,
        })}
      >
        {children}
      </form>
    );
  }
}
