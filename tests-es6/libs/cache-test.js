'use strict';

import * as Cache from 'js-es6/libs/cache';

describe('libs/cache', () => {
    describe('get()', () => {
        it('should return `null` if no item is found', () => {
            expect(Cache.get('foo')).toBeNull();
        });

        it('should return a value if an item exists', () => {
            Cache.set('foo', 123);

            expect(Cache.get('foo')).toBe(123);
        });

        it('should return falsey values if an item exists', () => {
            Cache.set('foo', false);

            expect(Cache.get('foo')).toBe(false);

            Cache.set('foo', '');

            expect(Cache.get('foo')).toBe('');

            Cache.set('foo', 0);

            expect(Cache.get('foo')).toBe(0);
        });
    });

    describe('set()', () => {
        it('should set a value by key', () => {
            Cache.set('bar', true);

            expect(Cache.get('bar')).toBe(true);
        });

        it('should overwrite a previous value', () => {
            Cache.set('bar', false);

            expect(Cache.get('bar')).toBe(false);
        });
    });

    describe('has()', () => {
        it('should verify if an item exists', () => {
            expect(Cache.has('foo')).toBe(true);
            expect(Cache.has('baz')).toBe(false);
        });
    });

    describe('remove()', () => {
        it('should remove an item by key', () => {
            Cache.set('qux', [1]);

            expect(Cache.get('qux')).toEqual([1]);

            Cache.remove('qux');

            expect(Cache.get('qux')).toBeNull();
        });
    });

    describe('flush()', () => {
        it('should remove all items', () => {
            expect(Cache.has('foo')).toBe(true);
            expect(Cache.has('bar')).toBe(true);

            Cache.flush();

            expect(Cache.has('foo')).toBe(false);
            expect(Cache.has('bar')).toBe(false);
        });
    });

    describe('cache()', () => {
        beforeEach(() => {
            Cache.flush();
        });

        it('should set a value if it doesn\'t exist', () => {
            expect(Cache.get('foo')).toBeNull();

            Cache.default('foo', 'bar');

            expect(Cache.get('foo')).toBe('bar');
        });

        it('should return the same value if it does exist', () => {
            Cache.default('foo', 'bar');

            expect(Cache.get('foo')).toBe('bar');

            Cache.default('foo', 'baz');

            expect(Cache.get('foo')).toBe('bar');
        });

        it('should set and return empty values (except nulls)', () => {
            Cache.default('foo', false);

            expect(Cache.get('foo')).toBe(false);

            Cache.default('foo', true);

            expect(Cache.get('foo')).toBe(false);
        });

        it('should allow nulls to be overwritten', () => {
            Cache.default('foo', null);

            expect(Cache.get('foo')).toBe(null);

            Cache.default('foo', 'bar');

            expect(Cache.get('foo')).toBe('bar');
        });

        it('should cache a value based on the return of a callback', () => {
            expect(Cache.get('foo')).toBeNull();

            Cache.default('foo', () => {
                return 5 * 5;
            });

            expect(Cache.get('foo')).toBe(25);
        });
    });
});
