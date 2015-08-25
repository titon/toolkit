'use strict';

import ElementCollection from 'ElementCollection';
import find from 'extensions/dom/find';

describe('extensions/dom/find', () => {
    describe('find()', () => {
        let element;

        beforeEach(() => {
            element = createElement('ul', {
                id: 'list',
                html: '<li>A</li><li>B</li><li>C</li>'
            });
        });

        afterEach(() => {
            element.cleanup();
        });

        it('should return a `ElementCollection` of `Element`s', () => {
            expect(find('#list li')).toEqual(new ElementCollection([
                element.childNodes[0],
                element.childNodes[1],
                element.childNodes[2]
            ]));
        });

        it('should return an empty `ElementCollection` if no elements are found', () => {
            expect(find('#foo div')).toEqual(new ElementCollection([]));
        });

        it('should allow for custom contexts', () => {
            expect(find('li', document.getElementById('list'))).toEqual(new ElementCollection([
                element.childNodes[0],
                element.childNodes[1],
                element.childNodes[2]
            ]));
        });
    });
});
