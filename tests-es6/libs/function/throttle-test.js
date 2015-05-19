'use strict';

import throttle from 'libs/function/throttle';

describe('libs/function/throttle', () => {
    describe('throttle()', () => {
        it('should delay callback execution to specific intervals', (done) => {
            let count = 1,
                start = Date.now(),
                callback = throttle(() => count += 1, 100);

            // Runs about 14 times
            var timer = setInterval(() => {
                if (Date.now() - start >= 1000) {
                    clearInterval(timer);
                } else {
                    callback();
                }
            }, 75);

            setTimeout(() => {
                expect(count).toBe(7);
                done();
            }, 1800);
        });

        it('should return the same function if no delay', () => {
            let base = () => {},
                func1 = throttle(base, 0),
                func2 = throttle(base);

            expect(func1).toEqual(base);
            expect(func2).not.toEqual(base);
        });
    });
});
