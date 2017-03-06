/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React from 'react';
import Input from './Input';
import style from '../../styler';
import { INPUT_CLASSES } from './types';
import { optionListPropType } from '../../propTypes';

import type { InputSelectProps, SelectOption } from './types';

export function renderOptions(options: SelectOption[]) {
  const elements = [];

  options.forEach((option) => {
    // Optgroup
    if (option.options) {
      elements.push(
        <optgroup
          key={option.label}
          label={option.label}
          disabled={option.disabled || false}
        >
          {renderOptions(option.options)}
        </optgroup>,
      );

    // Option
    } else {
      elements.push(
        <option
          key={option.value}
          value={option.value}
          disabled={option.disabled || false}
        >
          {option.label}
        </option>,
      );
    }
  });

  return elements;
}

export function ToolkitNativeSelect({ options, ...props }: InputSelectProps) {
  return (
    <Input {...props} type="select">
      {renderOptions(options)}
    </Input>
  );
}

ToolkitNativeSelect.propTypes = {
  options: optionListPropType.isRequired,
};

export default style({
  ...INPUT_CLASSES,
  input: 'input input-select',
})(ToolkitNativeSelect);
