'use strict';

import Element from 'Element';
import inDOM from 'extensions/dom/inDOM';

describe('extensions/dom/inDOM', () => {
    describe('inDOM()', () => {
        it('should return `true` if the element is found within the document', () => {
            let element = document.createElement('div');

            expect(inDOM(element)).toBe(false);

            document.body.appendChild(element);

            expect(inDOM(element)).toBe(true);

            document.body.removeChild(element);
        });

        it('should function normally if a `Element` is passed', () => {
            let element = document.createElement('div'),
                obj = new Element(element);

            expect(inDOM(obj)).toBe(false);

            document.body.appendChild(element);

            expect(inDOM(obj)).toBe(true);

            document.body.removeChild(element);
        });

        it('should return `false` if the body is passed', () => {
            expect(inDOM(document.body)).toBe(false);
        });
    });
});
