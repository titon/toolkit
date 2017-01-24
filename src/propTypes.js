/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes } from 'react';
import Titon from './Titon';
import collectionOf from './prop-types/collectionOf';

/**
 * A prop type for a list of positions on the x and y axis.
 */
export const axisPositions = PropTypes.oneOf(['top', 'bottom', 'left', 'right']);

/**
 * A prop type for the styles object passed by `Aesthetic`.
 * Should accept both class names (strings) and style objects (objects).
 */
export const classStyles = PropTypes.objectOf(PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.object,
]));

/**
 * Common default props between input components.
 */
export const inputDefaults = {
  defaultChecked: false,
  defaultValue: '',
  disabled: false,
  multiple: false,
  readOnly: false,
  required: false,
};

/**
 * Common prop types between input components.
 */
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

/**
 * A prop type shape for react-motion spring configuration.
 */
export const motionSpring = PropTypes.shape({
  stiffness: PropTypes.number,
  damping: PropTypes.number,
  precision: PropTypes.number,
});

/**
 * A prop type shape for an option within a select input list.
 */
export const optionShape = PropTypes.shape({
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
});

/**
 * A prop type shape for an optgroup within a select input list.
 */
export const optionGroupShape = PropTypes.shape({
  disabled: PropTypes.bool,
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(optionShape).isRequired,
});

/**
 * A prop type for a list of options.
 */
export const optionList = PropTypes.arrayOf(PropTypes.oneOfType([
  optionShape, optionGroupShape,
]));

/**
 * A prop type for a list of positions in each direction.
 */
export const positions = PropTypes.oneOf([
  'top-left', 'top', 'top-right',
  'left', 'right',
  'bottom-left', 'bottom', 'bottom-right',
]);

/**
 * Common prop types for show and hide events.
 */
export const showHidePropTypes = {
  onHidden: collectionOf.func,
  onHiding: collectionOf.func,
  onShowing: collectionOf.func,
  onShown: collectionOf.func,
};

/**
 * Common default props for supported sizes.
 */
export const sizeDefaults = {
  large: false,
  small: false,
};

/**
 * Common prop types for small and large sizes.
 */
export const sizePropTypes = {
  large: PropTypes.bool,
  small: PropTypes.bool,
};

/**
 * A prop type for a list of configurable states.
 */
export const states = PropTypes.oneOf(Titon.options.states);
