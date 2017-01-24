/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import style, { classes } from '../../styler';
import { sizeDefaults, sizePropTypes, classStyles } from '../../propTypes';

export class ToolkitButton extends React.PureComponent {
  static defaultProps = {
    ...sizeDefaults,
    disabled: false,
    primary: false,
    secondary: false,
    type: 'button',
  };

  static propTypes = {
    ...sizePropTypes,
    children: PropTypes.node,
    classNames: classStyles,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit']),
  };

  state = {
    pressed: false,
  };

  handleOnMouseDown = () => {
    this.setState({
      pressed: true,
    });
  };

  handleOnMouseUp = () => {
    this.setState({
      pressed: false,
    });
  };

  render() {
    const { pressed } = this.state;
    const {
      classNames,
      children,
      disabled,
      small,
      large,
      primary,
      secondary,
      href,
      type,
    } = this.props;
    let props = {
      role: 'button',
      className: classes(classNames.button, {
        [classNames.small]: small,
        [classNames.large]: large,
        [classNames.primary]: primary,
        [classNames.secondary]: secondary,
        [classNames.pressed]: pressed,
        [classNames.disabled]: disabled,
      }),
    };

    // If an anchor link
    if (href) {
      props.href = href;

      return (
        <a {...props}>
          {children}
        </a>
      );
    }

    // If a button
    props = {
      ...props,
      type,
      disabled,
      'aria-pressed': pressed,
      onMouseDown: this.handleOnMouseDown,
      onMouseUp: this.handleOnMouseUp,
    };

    return (
      <button {...props}>
        {children}
      </button>
    );
  }
}

export const CLASSES = {
  button: 'button',
  small: 'button--small',
  large: 'button--large',
  primary: 'button--primary',
  secondary: 'button--secondary',
  pressed: 'is-pressed',
  disabled: 'is-disabled',
};

export default style(CLASSES)(ToolkitButton);
