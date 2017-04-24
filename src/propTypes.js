/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import PropTypes from 'prop-types';

import type { Callback } from './types';

type InputPropTypes = {
  defaultChecked?: boolean,
  defaultValue?: string,
  disabled?: boolean,
  id?: string,
  multiple?: boolean,
  native?: boolean,
  onChanged?: Callback,
  onChanging?: Callback,
  readOnly?: boolean,
  required?: boolean,
};

type ShowHidePropTypes = {
  onHidden?: Callback,
  onHiding?: Callback,
  onShowing?: Callback,
  onShown?: Callback,
};

type SizePropTypes = {
  large?: boolean,
  small?: boolean,
};

export const axisPositionPropType = PropTypes.oneOf(['top', 'bottom', 'left', 'right']);

export const classNamesPropType = PropTypes.objectOf(PropTypes.string);

export const inputDefaults: InputPropTypes = {
  defaultChecked: false,
  defaultValue: '',
  disabled: false,
  id: '',
  invalid: false,
  multiple: false,
  native: true,
  onChanged() {},
  onChanging() {},
  readOnly: false,
  required: false,
};

export const inputPropTypes = {
  classNames: classNamesPropType.isRequired,
  defaultChecked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  invalid: PropTypes.bool,
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  native: PropTypes.bool,
  onChanged: PropTypes.func,
  onChanging: PropTypes.func,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
};

export const motionPropType = PropTypes.shape({
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  precision: PropTypes.number,
});

export const numberCollectionPropType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.arrayOf(PropTypes.number),
]);

export const optionPropType = PropTypes.shape({
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

export const optionGroupPropType = PropTypes.shape({
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(optionPropType).isRequired,
});

export const optionListPropType = PropTypes.arrayOf(PropTypes.oneOfType([
  optionPropType,
  optionGroupPropType,
]));

export const positionPropType = PropTypes.oneOf([
  'top-left', 'top', 'top-right',
  'left', 'right',
  'bottom-left', 'bottom', 'bottom-right',
]);

export const showHideDefaults: ShowHidePropTypes = {
  onHidden() {},
  onHiding() {},
  onShowing() {},
  onShown() {},
};

export const showHidePropTypes = {
  onHidden: PropTypes.func,
  onHiding: PropTypes.func,
  onShowing: PropTypes.func,
  onShown: PropTypes.func,
};

export const sizeDefaults: SizePropTypes = {
  large: false,
  small: false,
};

export const sizePropTypes = {
  large: PropTypes.bool,
  small: PropTypes.bool,
};

export const stylePropType = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.bool,
]));
