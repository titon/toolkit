'use strict';

import cache from 'extensions/utility/cache';

describe('extensions/utility/cache', () => {
    describe('cache()', () => {
        it('should set a value if it doesn\'t exist', () => {
            expect(cache('foo')).toBeNull();

            cache('foo', 1);

            expect(cache('foo')).toBe(1);
        });

        it('should return the same value if it does exist', () => {
            cache('bar', 1);

            expect(cache('bar')).toBe(1);

            cache('bar', 2);

            expect(cache('bar')).toBe(1);
        });

        it('should set and return empty values (except nulls)', () => {
            cache('baz', false);

            expect(cache('baz')).toBe(false);

            cache('baz', true);

            expect(cache('baz')).toBe(false);
        });

        it('should allow nulls to be overwritten', () => {
            cache('qux', null);

            expect(cache('qux')).toBe(null);

            cache('qux', 1);

            expect(cache('qux')).toBe(1);
        });

        it('should cache a value based on the return of a callback', () => {
            expect(cache('func')).toBeNull();

            cache('func', () => {
                return 5 * 5;
            });

            expect(cache('func')).toBe(25);
        });
    });
});
