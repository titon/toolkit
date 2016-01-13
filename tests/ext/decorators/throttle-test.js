/* eslint max-nested-callbacks: 0 */

import throttle from '../../../src/decorators/throttle';

class ThrottleStub {
    constructor() {
        this.with = 0;
        this.without = 0;
    }

    @throttle(25)
    withThrottle() {
        this.with++;
    }

    withoutThrottle() {
        this.without++;
    }
}

describe('ext/decorators/throttle()', () => {
    it('should delay the execution of throttled functions', done => {
        let obj = new ThrottleStub(),
            t1 = setInterval(obj.withThrottle.bind(obj), 10),
            t2 = setInterval(obj.withoutThrottle.bind(obj), 10);

        setTimeout(() => {
            clearInterval(t1);
            clearInterval(t2);

            // Give the throttle some timer to complete
            setTimeout(() => {
                expect(obj.with).toBe(5);
                expect(obj.without).toBe(10);

                done();
            }, 50);
        }, 100);
    });
});
