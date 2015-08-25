'use strict';

import Element from 'Element';
import findID from 'extensions/dom/findID';

describe('extensions/dom/findID', () => {
    describe('findID()', () => {
        it('should return a container for an element defined by an ID', () => {
            let element = createElement('div', { id: 'foo' });

            expect(findID('foo')).toEqual(new Element(element));
            expect(findID('#foo')).toEqual(new Element(element));

            element.cleanup();
        });

        it('should return null if no element is found', () => {
            expect(findID('bar')).toBeNull();
        });
    });
});
