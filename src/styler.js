/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Aesthetic, { createStyler, classes, ClassNameAdapter } from 'aesthetic';

const aesthetic = new Aesthetic(new ClassNameAdapter(), {
  // All Toolkit components should be extendable
  extendable: true,
  // We only work with class names
  stylesPropName: 'classNames',
});

export { aesthetic, classes };
export default createStyler(aesthetic);
