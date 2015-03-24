'use strict';

jest.dontMock('../cache');

var Cache = require('../cache');

describe('libs/cache', function() {
    describe('get()', function() {
        it('should return `null` if no item is found', function() {
            expect(Cache.get('foo')).toBeNull();
        });

        it('should return a value if an item exists', function() {
            Cache.set('foo', 123);

            expect(Cache.get('foo')).toBe(123);
        });

        it('should return falsey values if an item exists', function() {
            Cache.set('foo', false);

            expect(Cache.get('foo')).toBe(false);

            Cache.set('foo', '');

            expect(Cache.get('foo')).toBe('');

            Cache.set('foo', 0);

            expect(Cache.get('foo')).toBe(0);
        });
    });

    describe('set()', function() {
        it('should set a value by key', function() {
            Cache.set('bar', true);

            expect(Cache.get('bar')).toBe(true);
        });

        it('should overwrite a previous value', function() {
            Cache.set('bar', false);

            expect(Cache.get('bar')).toBe(false);
        });
    });

    describe('has()', function() {
        it('should verify if an item exists', function() {
            expect(Cache.has('foo')).toBe(true);
            expect(Cache.has('baz')).toBe(false);
        });
    });

    describe('remove()', function() {
        it('should remove an item by key', function() {
            Cache.set('qux', [1]);

            expect(Cache.get('qux')).toEqual([1]);

            Cache.remove('qux');

            expect(Cache.get('qux')).toBeNull();
        });
    });

    describe('flush()', function() {
        it('should remove all items', function() {
            expect(Cache.has('foo')).toBe(true);
            expect(Cache.has('bar')).toBe(true);

            Cache.flush();

            expect(Cache.has('foo')).toBe(false);
            expect(Cache.has('bar')).toBe(false);
        });
    });

    describe('cache()', function() {
        beforeEach(function() {
            Cache.flush();
        });

        it('should set a value if it doesn\'t exist', function() {
            expect(Cache.get('foo')).toBeNull();

            Cache.cache('foo', 'bar');

            expect(Cache.get('foo')).toBe('bar');
        });

        it('should return the same value if it does exist', function() {
            Cache.cache('foo', 'bar');

            expect(Cache.get('foo')).toBe('bar');

            Cache.cache('foo', 'baz');

            expect(Cache.get('foo')).toBe('bar');
        });

        it('should set and return empty values (except nulls)', function() {
            Cache.cache('foo', false);

            expect(Cache.get('foo')).toBe(false);

            Cache.cache('foo', true);

            expect(Cache.get('foo')).toBe(false);
        });

        it('should allow nulls to be overwritten', function() {
            Cache.cache('foo', null);

            expect(Cache.get('foo')).toBe(null);

            Cache.cache('foo', 'bar');

            expect(Cache.get('foo')).toBe('bar');
        });

        it('should cache a value based on the return of a callback', function() {
            expect(Cache.get('foo')).toBeNull();

            Cache.cache('foo', function() {
                return 5 * 5;
            });

            expect(Cache.get('foo')).toBe(25);
        });
    });
});
