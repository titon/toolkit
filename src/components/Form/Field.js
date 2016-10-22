/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Help from './Help';
import Label from './Label';
import MODULE from './module';

export default class Field extends Component {
  static module = MODULE;

  static defaultProps = {
    invalid: false,
    required: false,
  };

  static propTypes = {
    children: PropTypes.node,
    help: PropTypes.node,
    inputID: PropTypes.string,
    invalid: PropTypes.bool,
    label: PropTypes.node,
    required: PropTypes.bool,
  };

    /**
     * Render the form field list item.
     *
     * @returns {ReactElement}
     */
  render() {
    const props = this.props;

    return (
      <div
        className={this.formatChildClass('field', {
          'is-invalid': props.invalid,
          'is-required': props.required,
        })}
        {...this.inheritNativeProps(props)}
      >
        {props.label && (
        <Label inputID={props.inputID}>{props.label}</Label>
                )}

        {props.children}

        {props.help && (
        <Help inputID={props.inputID}>{props.help}</Help>
                )}
      </div>
        );
  }
}
