'use strict';

import isElement from 'extensions/dom/isElement';

describe('extensions/dom/isElement', () => {
    describe('isElement()', () => {
        it('should return `true` if a value is an element', () => {
            expect(isElement(document.createElement('div'))).toBe(true);
            expect(isElement('foo')).toBe(false);
            expect(isElement(123)).toBe(false);
            expect(isElement(true)).toBe(false);
            expect(isElement([])).toBe(false);
            expect(isElement({})).toBe(false);
        });
    });
});
