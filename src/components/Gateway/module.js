/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import defineModule from '../../utility/defineModule';

const module = defineModule('Gateway', {
  contextKey: 'gateway',
  blockClass: 'gateway',
  elementClasses: ['gate'],
});

const contextKey = module.contextKey;

export { contextKey };
export default module;
