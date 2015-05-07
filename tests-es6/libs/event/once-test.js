'use strict';

import once from 'libs/event/once';

describe('libs/event/once', () => {
    describe('once()', () => {
        let count, element;

        beforeEach(() => {
            count = 0;

            element = document.createElement('div');
            element.addEventListener('foo', once(() => count++));
            element.addEventListener('bar', once((e) => count = e.detail.count));

            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
        });

        it('should only trigger the event listener once', () => {
            expect(count).toBe(0);

            element.dispatchEvent(new CustomEvent('foo'));
            element.dispatchEvent(new CustomEvent('foo'));
            element.dispatchEvent(new CustomEvent('foo'));

            expect(count).toBe(1);
        });

        it('should pass the event to the original function', () => {
            expect(count).toBe(0);

            element.dispatchEvent(new CustomEvent('bar', { detail: { count: 5 }}));
            element.dispatchEvent(new CustomEvent('bar', { detail: { count: 10 }}));
            element.dispatchEvent(new CustomEvent('bar', { detail: { count: 15 }}));

            expect(count).toBe(5);
        });
    });
});
