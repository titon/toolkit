/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import defineModule from '../../utility/defineModule';

export default defineModule('Carousel', {
  contextKey: 'carousel',
  blockClass: 'carousel',
  elementClasses: ['item', 'item-list', 'next', 'prev', 'start', 'stop', 'tab', 'tab-list'],
});
