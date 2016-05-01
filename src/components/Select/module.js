/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import defineModule from '../../utility/defineModule';

export default defineModule('Select', '3.0.0', {
    contextKey: 'select',
    blockClass: 'select',
    elementClasses: [
        'arrow', 'label', 'toggle', 'menu',
        'group', 'option', 'option-label', 'option-desc'
    ]
});
