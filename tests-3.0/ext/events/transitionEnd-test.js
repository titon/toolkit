'use strict';

import transitionEnd from 'extensions/event/transitionEnd';
import 'polyfills/requestAnimationFrame';

describe('extensions/event/transitionEnd', () => {
    describe('transitionEnd()', () => {
        let transitioned, element;

        beforeEach(() => {
            transitioned = false;

            element = createElement('div', {
                css: { backgroundColor: 'black' }
            });
            element.style.setProperty('transition', 'background 150ms', 'important');
        });

        afterEach(() => {
            element.cleanup();
        });

        /* TODO - This seems to work sometimes, but not always. Why!?
        it('should trigger the function when the transition is complete', (done) => {
            expect(transitioned).toBe(false);

            element = transitionEnd(element, () => transitioned = true);

            processInThread(() => {
                element.style.backgroundColor = 'red';
            });

            expect(transitioned).toBe(false);

            requestAnimationFrame(() => {
                setTimeout(() => {
                    expect(transitioned).toBe(true);
                    done();
                }, 300);
            });
        });*/

        it('should trigger the function immediately if no transition exists', () => {
            expect(transitioned).toBe(false);

            element.style.setProperty('transition', 'background 0s', 'important');

            transitionEnd(element, () => transitioned = true);

            expect(transitioned).toBe(true);
        });
    });
});
