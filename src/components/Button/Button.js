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
    type: 'button',
  };

  static propTypes = {
    ...sizePropTypes,
    children: PropTypes.node,
    classNames: classStyles,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit']),
  };

  state = {
    pressed: false,
  };

  handleMouseDown = () => {
    this.setState({
      pressed: true,
    });
  };

  handleMouseUp = () => {
    this.setState({
      pressed: false,
    });
  };

  render() {
    const { pressed } = this.state;
    const {
      children,
      classNames,
      disabled,
      small,
      large,
      href,
      type,
      onClick,
      onMouseOver,
      onMouseOut,
    } = this.props;
    let props = {
      onClick,
      onMouseOver,
      onMouseOut,
      role: 'button',
      className: classes(classNames.button, {
        [classNames.small]: small,
        [classNames.large]: large,
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
      onMouseDown: this.handleMouseDown,
      onMouseUp: this.handleMouseUp,
      'aria-pressed': pressed,
    };

    return (
      <button {...props}>
        {children}
      </button>
    );
  }
}

export default style({
  button: 'button',
  small: 'button--small',
  large: 'button--large',
  pressed: 'is-pressed',
  disabled: 'is-disabled',
})(ToolkitButton);
