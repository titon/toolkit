/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class ButtonGroup extends Component {
  static module = MODULE;

  static defaultProps = {
    justified: false,
    label: 'Button Group',
    vertical: false,
  };

  static propTypes = {
    children: PropTypes.node,
    justified: PropTypes.bool,
    label: PropTypes.string,
    vertical: PropTypes.bool,
  };

  render() {
    const props = this.props;

    return (
      <ul
        role="toolbar"
        id={this.formatID('button-group')}
        className={this.formatClass({
          '@justified': props.justified,
          '@vertical': props.vertical,
        })}
        aria-label={props.label}
      >
        {Children.map(props.children, child => (
          <li>{child}</li>
        ))}
      </ul>
    );
  }
}
