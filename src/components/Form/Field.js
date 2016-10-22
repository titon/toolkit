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
    const { children, invalid, required, label, help, inputID } = this.props;

    return (
      <div
        className={this.formatChildClass('field', {
          'is-invalid': invalid,
          'is-required': required,
        })}
      >
        {label && (
          <Label inputID={inputID}>{label}</Label>
        )}

        {children}

        {help && (
          <Help inputID={inputID}>{help}</Help>
        )}
      </div>
    );
  }
}
