/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint operator-linebreak: 0 */

(proto => {
    proto.matches =
        proto.matches ||
        proto.matchesSelector ||
        proto.webkitMatchesSelector ||
        proto.mozMatchesSelector ||
        proto.msMatchesSelector ||
        proto.oMatchesSelector;
})(Element.prototype);
