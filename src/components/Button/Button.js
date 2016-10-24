/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import { defaultSizeProps, sizePropTypes, states } from '../../propTypes';
import MODULE from './module';

export default class Button extends Component {
  static module = MODULE;

  static defaultProps = {
    ...defaultSizeProps,
    primary: false,
    secondary: false,
    type: 'button',
  };

  static propTypes = {
    ...sizePropTypes,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    href: PropTypes.string,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    state: states,
    type: PropTypes.oneOf(['button', 'submit']),
  };

  state = {
    pressed: false,
  };

  @bind
  handleOnMouseDown() {
    this.setState({
      pressed: true,
    });
  }

  @bind
  handleOnMouseUp() {
    this.setState({
      pressed: false,
    });
  }

  render() {
    const { pressed } = this.state;
    const props = this.props;
    let buttonProps = {
      className: this.formatClass({
        '@large': props.large,
        '@primary': props.primary,
        '@secondary': props.secondary,
        '@small': props.small,
        [`@${props.state}`]: props.state,
        'is-disabled': props.disabled,
        'is-pressed': pressed,
      }),
      role: 'button',
    };

    // If an anchor link
    if (props.href) {
      buttonProps.href = props.href;

      return (
        <a {...buttonProps}>
          {props.children}
        </a>
      );
    }

    // If a button
    buttonProps = {
      ...buttonProps,
      'aria-pressed': pressed,
      disabled: props.disabled,
      onMouseDown: this.handleOnMouseDown,
      onMouseUp: this.handleOnMouseUp,
      type: props.type,
    };

    return (
      <button {...buttonProps}>
        {props.children}
      </button>
    );
  }
}
