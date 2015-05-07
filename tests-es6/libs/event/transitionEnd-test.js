'use strict';

import transitionEnd from 'libs/event/transitionEnd';

describe('libs/event/transitionEnd', () => {
    describe('transitionEnd()', () => {
        let transitioned, element;

        beforeEach(() => {
            transitioned = false;

            element = document.createElement('div');
            element.style.setProperty('transition', 'background 250ms', 'important');
            element.style.backgroundColor = 'black';

            document.body.appendChild(element);
        });

        afterEach(() => {
            document.body.removeChild(element);
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
