/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children } from 'react';
import PropTypes from 'prop-types';
import style, { classes } from '../../styler';
import { classNamesPropType } from '../../propTypes';
import formatID from '../../utility/formatID';
import generateUID from '../../utility/generateUID';

import type { ButtonGroupProps } from './types';

export class ToolkitButtonGroup extends React.PureComponent {
  props: ButtonGroupProps;

  static propTypes = {
    children: PropTypes.node.isRequired,
    classNames: classNamesPropType.isRequired,
    justified: PropTypes.bool,
    label: PropTypes.string,
    vertical: PropTypes.bool,
  };

  static defaultProps = {
    justified: false,
    label: 'Button Group',
    vertical: false,
  };

  uid: string = generateUID();

  render() {
    const { children, classNames, justified, vertical, label } = this.props;

    return (
      <ul
        role="toolbar"
        id={formatID('button-group', this.uid)}
        className={classes(classNames.buttonGroup, {
          [classNames.buttonGroup__justified]: justified,
          [classNames.buttonGroup__vertical]: vertical,
        })}
        aria-label={label}
      >
        {Children.map(children, child => (
          <li>{child}</li>
        ))}
      </ul>
    );
  }
}

export default style({
  buttonGroup: 'button-group',
  buttonGroup__justified: 'button-group--justified',
  buttonGroup__vertical: 'button-group--vertical',
})(ToolkitButtonGroup);
