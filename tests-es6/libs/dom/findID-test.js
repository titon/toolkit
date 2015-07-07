'use strict';

import Element from 'libs/dom/Element';
import findID from 'libs/dom/findID';

describe('libs/dom/findID', () => {
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
