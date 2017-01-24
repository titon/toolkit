/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import formatInputName from '../../utility/formatInputName';
import emitEvent from '../../utility/emitEvent';
import invariant from '../../utility/invariant';
import {
    defaultInputProps, defaultSizeProps,
    inputPropTypes, sizePropTypes,
} from '../../propTypes';
import MODULE from './module';

export default class Input extends Component {
  static module = MODULE;

  static defaultProps = {
    ...defaultInputProps,
    ...defaultSizeProps,
    type: 'text',
  };

  static propTypes = {
    ...inputPropTypes,
    ...sizePropTypes,
    children: PropTypes.node,
    type: PropTypes.string,
  };

  constructor(props) {
    super();

    const compName = this.constructor.name.toLowerCase();
    let defaultValue = props.defaultValue;
    let defaultChecked = props.defaultChecked;

    // Select
    if (compName === 'select') {
      if (props.multiple) {
        defaultValue = Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      } else {
        defaultValue = String(defaultValue);
      }

    // Checkbox, Switch
    } else if (compName === 'switch' || compName === 'checkbox' || props.type === 'checkbox') {
      if (props.multiple) {
        invariant(defaultValue,
                    'A default value is required when using `multiple` checkboxes.');
      } else {
        defaultValue = defaultValue || '1';
      }

    // Radio
    } else if (compName === 'radio' || props.type === 'radio') {
      invariant(defaultValue, 'A default value is required when using radios.');

      if (typeof defaultChecked === 'string') {
        defaultChecked = (defaultValue === defaultChecked);
      }
    }

    this.state = {
      checked: Boolean(defaultChecked),
      type: (compName === 'input') ? props.type : compName,
      value: defaultValue,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.value !== this.state.value || nextState.checked !== this.state.checked);
  }

  componentWillUpdate(nextProps, nextState) {
    const { checked, value } = nextState;
    const args = this.isChoiceType() ? [checked, value] : [value, this.state.value];

    emitEvent(this, 'onChanging', ...args);
  }

  componentDidUpdate(prevProps, prevState) {
    const { checked, value } = this.state;
    const args = this.isChoiceType() ? [checked, value] : [value, prevState.value];

    emitEvent(this, 'onChanged', ...args);
  }

  gatherProps(native = true) {
    const props = this.props;
    const state = this.state;
    let inputProps = {
      disabled: props.disabled,
      id: props.id || formatInputName(props.name),
      name: props.name,
      onChange: this.handleOnChange,
      readOnly: props.readOnly,
      required: props.required,
      value: state.value,
    };

    // Native elements inherit more base functionality
    // Custom elements define their own classes and props
    if (native) {
      inputProps = {
        ...inputProps,
        className: this.formatClass({
          '@large': props.large,
          '@small': props.small,
          [`@${state.type}`]: true,
          ...this.gatherStateClasses(),
        }),
      };
    }

    switch (state.type) {
      // Add specific props and append a value to the ID
      case 'checkbox':
      case 'radio':
      case 'switch':
        inputProps.type = state.type;
        inputProps.checked = state.checked;
        inputProps.multiple = props.multiple;

        if (!props.id && (props.multiple || state.type === 'radio')) {
          inputProps.id += `-${state.value}`;
        }
        break;

      // These aren't native HTML inputs but we need to catch them
      case 'select':
        inputProps.multiple = props.multiple;
        break;

      case 'textarea':
        break;

      // Only include the type on true input elements
      default:
        inputProps.type = props.type;
        break;
    }

    return inputProps;
  }

  gatherStateClasses() {
    const { disabled, multiple, readOnly, required } = this.props;

    return {
      'is-checked': this.state.checked,
      'is-disabled': disabled,
      'is-multiple': multiple,
      'is-read-only': readOnly,
      'is-required': required,
    };
  }

  isChoiceType() {
    return ['checkbox', 'radio', 'switch'].includes(this.state.type);
  }

  @bind
  handleOnChange(e) {
    const newState = {};

    if (this.isChoiceType()) {
      newState.checked = !this.state.checked;
    } else {
      newState.value = e.target.value;
    }

    this.setState(newState);
  }

  render() {
    return (
      <input {...this.gatherProps()} />
    );
  }
}
