'use strict';

import forOwn from 'libs/object/forOwn';

describe('libs/object/forOwn', () => {
    describe('forOwn()', () => {
        it('should loop over an object and execute a function', () => {
            let values = [],
                base = {
                    foo: 'abc',
                    bar: 123,
                    baz: true,
                    qux: [null]
                };

            forOwn(base, key => values.push(base[key]));

            expect(values).toEqual([
                'abc',
                123,
                true,
                [null]
            ]);
        });
    });
});
