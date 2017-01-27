/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import style, { classes } from '../../styler';
import { classStylePropType } from '../../propTypes';
import formatID from '../../utility/formatID';
import generateUID from '../../utility/generateUID';

export class ToolkitButtonGroup extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node,
    classNames: classStylePropType,
    justified: PropTypes.bool,
    label: PropTypes.string,
    vertical: PropTypes.bool,
  };

  static defaultProps = {
    justified: false,
    label: 'Button Group',
    vertical: false,
  };

  uid = generateUID();

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
