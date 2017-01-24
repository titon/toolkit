/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Input from './Input';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import { optionList } from '../../propTypes';

export default class Select extends Input {
  static defaultProps = {
    ...Input.defaultProps,
    defaultValue: [],
  };

  static propTypes = {
    ...Input.propTypes,
    defaultValue: collectionOf.string,
    options: optionList.isRequired,
  };

  @bind
  handleOnChange({ target }) {
    const newState = {};

    if (this.props.multiple) {
      newState.value = Array.from(target.selectedOptions).map(option => option.value);
    } else {
      newState.value = target.value;
    }

    this.setState(newState);
  }

  renderOptions(options) {
    const elements = [];

    options.forEach((option) => {
      // Optgroup
      if (option.options) {
        elements.push(
          <optgroup
            key={option.label}
            label={option.label}
            disabled={option.disabled}
          >
            {this.renderOptions(option.options)}
          </optgroup>,
        );

      // Option
      } else {
        elements.push(
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>,
        );
      }
    });

    return elements;
  }

  render() {
    return (
      <select {...this.gatherProps()}>
        {this.renderOptions(this.props.options)}
      </select>
    );
  }
}
