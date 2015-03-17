/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

export function find(query, context) {
    if (query.charAt(0) === '#') {
        return document.getElementById(query);
    }

    return (context || document).querySelectorAll(query);
}

export function isElement(element) {
    if ('HTMLElement' in window) {
        return (element instanceof HTMLElement);
    }

    return (element.nodeName && element.nodeType && element.nodeType === 1);
}
