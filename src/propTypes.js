/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import { PropTypes } from 'react';
import collectionOf from './prop-types/collectionOf';

import type { InputPropTypes, ShowHidePropTypes, SizePropTypes } from './types';

export const axisPositionPropType = PropTypes.oneOf(['top', 'bottom', 'left', 'right']);

export const classNamesPropType = PropTypes.objectOf(PropTypes.string);

export const inputDefaults: InputPropTypes = {
  defaultChecked: false,
  defaultValue: '',
  disabled: false,
  id: '',
  multiple: false,
  onChanged() {},
  onChanging() {},
  readOnly: false,
  required: false,
};

export const inputPropTypes = {
  defaultChecked: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onChanged: collectionOf.func,
  onChanging: collectionOf.func,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
};

export const motionSpringPropType = PropTypes.shape({
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  precision: PropTypes.number,
});

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
