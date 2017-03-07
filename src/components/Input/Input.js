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
import toArray from '../../utility/toArray';
import { classes } from '../../styler';
import {
  classNamesPropType,
  inputDefaults, sizeDefaults,
  inputPropTypes, sizePropTypes,
} from '../../propTypes';

import type { InputProps, InputState, ChangedData, RenderedProps } from './types';
import type { HandlerEvent } from '../../types';

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

    switch (props.type) {
      case 'select':
        if (props.multiple) {
          defaultValue = toArray(defaultValue).map(String);
        } else {
          defaultValue = String(defaultValue);
        }
        break;

      case 'checkbox':
        if (props.multiple) {
          invariant(defaultValue, 'A default value is required when using `multiple` checkboxes.');

          defaultChecked = (defaultValue === defaultChecked);

        } else if (!defaultValue) {
          defaultValue = '1';
        }
        break;

      case 'radio':
        invariant(defaultValue, 'A default value is required when using radios.');

        defaultChecked = (defaultValue === defaultChecked);
        break;

      default: break;
    }

    this.uid = props.id || formatInputName(props.name);
    this.state = {
      checked: Boolean(defaultChecked),
      value: defaultValue,
    };
  }

  shouldComponentUpdate(nextProps: InputProps, { checked, value }: InputState) {
    return (value !== this.state.value || checked !== this.state.checked);
  }

  componentWillUpdate(nextProps: InputProps, { checked, value }: InputState) {
    const { name, type } = this.props;
    const data: ChangedData = { name, value };

    if (type === 'checkbox' || type === 'radio') {
      data.checked = checked;
    }

    emitEvent(this, 'input', 'onChanging', data);
  }

  componentDidUpdate() {
    const { checked, value } = this.state;
    const { name, type } = this.props;
    const data: ChangedData = { name, value };

    if (type === 'checkbox' || type === 'radio') {
      data.checked = checked;
    }

    emitEvent(this, 'input', 'onChanged', data);
  }

  handleOnChange = ({ target }: HandlerEvent) => {
    const { type, multiple } = this.props;
    const nextState = {};

    switch (type) {
      case 'select':
        if (multiple) {
          nextState.value = Array.from(target.selectedOptions || []).map(option => option.value);
        } else {
          nextState.value = target.value;
        }
        break;

      case 'checkbox':
      case 'radio':
        nextState.checked = !this.state.checked;
        break;

      default:
        nextState.value = target.value;
        break;
    }

    this.setState(nextState);
  };

  render() {
    const { children, classNames, ...props } = this.props;
    const state = this.state;
    const inputProps: RenderedProps = {
      disabled: props.disabled,
      id: this.uid,
      invalid: props.invalid,
      name: props.name,
      onChange: this.handleOnChange,
      readOnly: props.readOnly,
      required: props.required,
      value: state.value,
    };

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

        if (!props.id && (props.multiple || props.type === 'radio')) {
          // $FlowIgnore We know these are strings
          inputProps.id = `${inputProps.id}-${state.value}`;
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
