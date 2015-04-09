'use strict';

import { delegate, once, transitionEnd } from 'js-es6/libs/event';

describe('libs/event', () => {
    let element;

    afterEach(() => {
        if (element) {
            document.body.removeChild(element);
        }
    });

    describe('delegate()', () => {
        var count;

        beforeEach(() => {
            count = 0;

            element = document.createElement('div');
            element.innerHTML = '<span id="a" class="foo"></span>' +
                '<span id="b"></span>' +
                '<span id="c" class="foo"></span>';

            document.body.appendChild(element);
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

    describe('once()', () => {
        let count;

        beforeEach(() => {
            count = 0;

            element = document.createElement('div');
            element.addEventListener('foo', once(() => count++));
            element.addEventListener('bar', once((e) => count = e.detail.count));

            document.body.appendChild(element);
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

    describe('transitionEnd()', () => {
        let transitioned;

        beforeEach(() => {
            transitioned = false;

            element = document.createElement('div');
            element.style.setProperty('transition', 'background 250ms', 'important');
            element.style.backgroundColor = 'black';

            document.body.appendChild(element);
        });

        it('should trigger the function when the transition is complete', (done) => {
            expect(transitioned).toBe(false);

            element = transitionEnd(element, () => transitioned = true);

            // We must trigger the style change in a separated thread
            setTimeout(() => {
                element.style.backgroundColor = 'red';
            }, 0);

            expect(transitioned).toBe(false);

            setTimeout(() => {
                expect(transitioned).toBe(true);

                done();
            }, 300);
        });

        it('should trigger the function immediately if no transition exists', () => {
            expect(transitioned).toBe(false);

            element.style.setProperty('transition', 'background 0s', 'important');

            transitionEnd(element, () => transitioned = true);

            expect(transitioned).toBe(true);
        });
    });
});
