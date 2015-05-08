'use strict';

import Element from 'libs/dom/Element';
import id from 'libs/dom/id';

describe('libs/dom/id', () => {
    describe('id()', () => {
        it('should return a container for an element defined by an ID', () => {
            let element = document.createElement('div');
                element.id = 'foo';

            document.body.appendChild(element);

            expect(id('foo')).toEqual(new Element(element));

            document.body.removeChild(element);
        });

        it('should return null if no element is found', () => {
            expect(id('bar')).toBeNull();
        });
    });
});
