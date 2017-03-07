/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import { classes } from '../../styler';

const MODIFIER_CLASSES = [
  'checked', 'disabled', 'invalid', 'large',
  'multiple', 'readOnly', 'required', 'small',
];

export default function combineClasses(prefix: string, props: Object, state: Object): string {
  const classAccumulator = {};

  MODIFIER_CLASSES.forEach((modifier) => {
    classAccumulator[props.classNames[`${prefix}__${modifier}`]] = (modifier === 'checked')
      ? state[modifier]
      : props[modifier];
  });

  return classes(props.classNames[prefix], classAccumulator);
}
