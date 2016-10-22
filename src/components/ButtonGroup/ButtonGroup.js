/**
 * @copyright   2010-2016, The Titon Project
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

    /**
     * Render the button group as a list of buttons.
     *
     * @returns {ReactElement}
     */
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
        {...this.inheritNativeProps(props)}
      >
        {Children.map(props.children, child => (
          <li>{child}</li>
                ))}
      </ul>
        );
  }
}
