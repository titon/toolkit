/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint operator-linebreak: 0 */

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame =
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.msCancelAnimationFrame ||
        function cancelAnimationFrame(id) {
            clearTimeout(id);
        };
}
