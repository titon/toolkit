'use strict';

import delegate from 'libs/event/delegate';

describe('libs/event/delegate', () => {
    describe('delegate()', () => {
        var count, element;

        beforeEach(() => {
            count = 0;

            element = createElement('div', {
                html: '<span id="a" class="foo"></span><span id="b"></span><span id="c" class="foo"></span>'
            });
        });

        afterEach(() => {
            element.cleanup();
        });

        it('should trigger the function if the selector was clicked', () => {
            element.addEventListener('click', delegate('.foo', () => count++));

            expect(count).toBe(0);

            for (let i = 0; i < element.children.length; i++) {
                element.children[i].click();
            }

            expect(count).toBe(2);
        });

        it('should trigger if the selector is an ID', () => {
            element.addEventListener('click', delegate('#b', () => count++));

            expect(count).toBe(0);

            for (let i = 0; i < element.children.length; i++) {
                element.children[i].click();
            }

            expect(count).toBe(1);
        });
    });
});
