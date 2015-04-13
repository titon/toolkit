/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Container from './container';

export default class Collection {
    length = 0;

    elements = [];

    constructor(elements) {
        this.elements = elements.map(element => new Container(element));
        this.length = elements.length;
    }

    each(func) {
        let elements = this.elements;

        for (let i = 0, l = this.length; i < l; i++) {
            func.call(elements, elements[i], i);
        }

        return this;
    }
}

Container.getCollectionMethods().forEach(method => {
    Collection.prototype[method] = function() {
        let response = this.elements.forEach(element => element[method].apply(element, arguments));

        return (response instanceof Container) ? this : response;
    }
});
