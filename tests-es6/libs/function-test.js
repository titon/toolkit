'use strict';

import * as Func from 'js-es6/libs/function';

describe('libs/function', () => {
    describe('debounce()', () => {
        it('should trigger the callback once the duration is up', (done) => {
            let count = 1;

            Func.debounce(() => count += 1)();

            expect(count).toBe(1);

            setTimeout(() => {
                expect(count).toBe(2);
                done();
            }, 160);
        });
    });

    describe('throttle()', () => {
        it('should delay callback execution to specific intervals', (done) => {
            let count = 1,
                start = Date.now(),
                callback = Func.throttle(() => count += 1, 100);

            // Runs about 14 times
            var timer = setInterval(() => {
                if (Date.now() - start >= 1000) {
                    clearInterval(timer);
                } else {
                    callback();
                }
            }, 75);

            setTimeout(() => {
                expect(count).toBe(8);
                done();
            }, 1800);
        });
    });
});
