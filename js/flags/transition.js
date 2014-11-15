/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define(function() {

// Check if transitions exist
var hasTransition = (function() {
    var prefixes = 'transition WebkitTransition MozTransition OTransition msTransition'.split(' '),
        style = document.createElement('div').style;

    for (var i = 0; i < prefixes.length; i++) {
        if (prefixes[i] in style) {
            return prefixes[i];
        }
    }

    return false;
})();

return hasTransition;
});