/* eslint max-nested-callbacks: 0 */

import debounce from '../../../src/decorators/debounce';

class DebounceStub {
    constructor() {
        this.with = 0;
        this.without = 0;
    }

    @debounce(25)
    withDebounce() {
        this.with++;
    }

    withoutDebounce() {
        this.without++;
    }
}

describe('ext/decorators/debounce()', () => {
    it('should delay the execution of debounced functions', done => {
        let obj = new DebounceStub(),
            t1 = setInterval(obj.withDebounce.bind(obj), 10),
            t2 = setInterval(obj.withoutDebounce.bind(obj), 10);

        setTimeout(() => {
            clearInterval(t1);
            clearInterval(t2);

            // Give the debounce some timer to complete
            setTimeout(() => {
                expect(obj.with).toBe(1);
                expect(obj.without).toBe(10);

                done();
            }, 50);
        }, 100);
    });
});
