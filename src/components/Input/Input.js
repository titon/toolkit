/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React, { PropTypes } from 'react';
import formatInputName from '../../utility/formatInputName';
import emitEvent from '../../utility/emitEvent';
import invariant from '../../utility/invariant';
import { classes } from '../../styler';
import {
  classNamesPropType,
  inputDefaults, sizeDefaults,
  inputPropTypes, sizePropTypes,
} from '../../propTypes';

import type { InputProps, InputState } from './types';
import type { PropsMap } from '../../types';

// Private
export default class BaseInput extends React.Component {
  props: InputProps;
  state: InputState;
  uid: string;

  static propTypes = {
    ...inputPropTypes,
    ...sizePropTypes,
    children: PropTypes.node,
    classNames: classNamesPropType.isRequired,
    type: PropTypes.string.isRequired,
  };

  static defaultProps = {
    ...inputDefaults,
    ...sizeDefaults,
  };

  constructor(props: InputProps) {
    super();

    let defaultValue = props.defaultValue;
    let defaultChecked = props.defaultChecked;

    // Select
    if (props.type === 'select') {
      if (props.multiple) {
        defaultValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      } else {
        defaultValue = String(defaultValue);
      }

    // Checkbox, Switch
    } else if (props.type === 'checkbox') {
      if (props.multiple) {
        invariant(defaultValue, 'A default value is required when using `multiple` checkboxes.');
      } else {
        defaultValue = defaultValue || '1';
      }

    // Radio
    } else if (props.type === 'radio') {
      invariant(defaultValue, 'A default value is required when using radios.');

      if (typeof defaultChecked === 'string') {
        defaultChecked = (defaultValue === defaultChecked);
      }
    }

    this.uid = props.id || formatInputName(props.name);
    this.state = {
      checked: Boolean(defaultChecked),
      value: defaultValue,
    };
  }

  shouldComponentUpdate(nextProps: InputProps, nextState: InputState) {
    return (nextState.value !== this.state.value || nextState.checked !== this.state.checked);
  }

  componentWillUpdate(nextProps: InputProps, nextState: InputState) {
    const { checked, value } = nextState;
    const args = this.isChoiceType() ? [checked, value] : [value, this.state.value];

    emitEvent(this, 'input', 'onChanging', ...args);
  }

  componentDidUpdate(prevProps: InputProps, prevState: InputState) {
    const { checked, value } = this.state;
    const args = this.isChoiceType() ? [checked, value] : [value, prevState.value];

    emitEvent(this, 'input', 'onChanged', ...args);
  }

  isChoiceType(): boolean {
    return ['checkbox', 'radio'].includes(this.props.type);
  }

  handleOnChange = ({ target }: Event) => {
    const { type, multiple } = this.props;
    const newState = {};

    if (this.isChoiceType()) {
      newState.checked = !this.state.checked;
    } else {
      newState.value = target.value;

      if (type === 'select' && multiple) {
        newState.value = Array.from(target.selectedOptions).map(option => option.value);
      }
    }

    this.setState(newState);
  };

  render() {
    const { children, classNames, ...props } = this.props;
    const state = this.state;
    const inputProps: PropsMap = {
      disabled: props.disabled,
      id: this.uid,
      name: props.name,
      onChange: this.handleOnChange,
      readOnly: props.readOnly,
      required: props.required,
      value: state.value,
    };

    // Native elements inherit more base functionality
    // Custom elements define their own classes and props
    if (props.native) {
      inputProps.className = classes(classNames.input, {
        [classNames.input__small]: props.small,
        [classNames.input__large]: props.large,
        [classNames.input__checked]: state.checked,
        [classNames.input__disabled]: props.disabled,
        [classNames.input__invalid]: props.invalid,
        [classNames.input__multiple]: props.multiple,
        [classNames.input__readOnly]: props.readOnly,
        [classNames.input__required]: props.required,
      });
    }

    switch (props.type) {
      case 'select':
        inputProps.multiple = props.multiple;

        return (
          <select {...inputProps}>
            {children}
          </select>
        );

      case 'textarea':
        return (
          <textarea {...inputProps} />
        );

      case 'checkbox':
      case 'radio':
        inputProps.checked = state.checked;
        inputProps.multiple = props.multiple;

        if (
          !props.id &&
          (props.multiple || props.type === 'radio') &&
          typeof state.value === 'string'
        ) {
          inputProps.id += `-${state.value}`;
        }

      // eslint-disable-next-line no-fallthrough
      default:
        inputProps.type = props.type;

        return (
          <input {...inputProps} />
        );
    }
  }
}
