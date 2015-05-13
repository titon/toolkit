'use strict';

import batch from 'libs/dom/batch';

describe('libs/dom/batch', () => {
    describe('batch()', () => {
        let element;

        beforeEach(() => {
            element = createElement('ul', {
                html: '<li>A</li><li>B</li><li>C</li>'
            });
        });

        afterEach(() => {
            element.cleanup();
        });

        it('should batch changes to a single element', () => {
            batch(element.childNodes[1], (child) => {
                child.style.color = 'red';
            });

            expect(element.childNodes[0].style.color).toBe('');
            expect(element.childNodes[1].style.color).toBe('red');
            expect(element.childNodes[2].style.color).toBe('');
        });

        it('should re-insert the element in its original position', () => {
            batch(element.childNodes[0], (child) => {
                child.className = 'foo';
            });

            expect(element.childNodes[0].className).toBe('foo');
            expect(element.childNodes[1].className).toBe('');
            expect(element.childNodes[2].className).toBe('');
        });

        it('should re-insert the element in the last position', () => {
            batch(element.childNodes[2], (child) => {
                child.id = 'bar';
            });

            expect(element.childNodes[0].id).toBe('');
            expect(element.childNodes[1].id).toBe('');
            expect(element.childNodes[2].id).toBe('bar');
        });
    });
});
