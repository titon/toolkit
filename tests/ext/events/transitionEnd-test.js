import transitionEnd from '../../../src/ext/events/transitionEnd';
import '../../../src/ext/polyfills/requestAnimationFrame';

describe('ext/events/transitionEnd()', () => {
    let transitioned = false,
        element = null;

    beforeEach(() => {
        transitioned = false;

        element = createElement('div', { css: { color: 'black' } });
        element.style.setProperty('transition', 'background 150ms', 'important');
    });

    afterEach(() => {
        element.cleanup();
    });

    /*
    it('should trigger the function when the transition is complete', (done) => {
        expect(transitioned).toBe(false);

        element = transitionEnd(element, () => {
            transitioned = true;
        });

        processInThread(() => {
            element.style.color = 'red';
        });

        expect(transitioned).toBe(false);

        requestAnimationFrame(() => {
            setTimeout(() => {
                expect(transitioned).toBe(true);
                done();
            }, 400);
        });
    });
    */

    it('should trigger the function immediately if no transition exists', () => {
        expect(transitioned).toBe(false);

        element.style.setProperty('transition', 'color 0s', 'important');

        transitionEnd(element, () => transitioned = true);

        expect(transitioned).toBe(true);
    });
});
