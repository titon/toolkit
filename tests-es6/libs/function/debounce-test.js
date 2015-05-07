'use strict';

import debounce from 'libs/function/debounce';

describe('libs/function/debounce', () => {
    describe('debounce()', () => {
        it('should trigger the callback once the duration is up', (done) => {
            let count = 1;

            debounce(() => count += 1)();

            expect(count).toBe(1);

            setTimeout(() => {
                expect(count).toBe(2);
                done();
            }, 160);
        });

        it('should return the same function if no threshold', () => {
            let base = () => {},
                func1 = debounce(base, 0),
                func2 = debounce(base);

            expect(func1).toEqual(base);
            expect(func2).not.toEqual(base);
        });
    });
});
