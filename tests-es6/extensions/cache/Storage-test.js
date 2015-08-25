'use strict';

import Storage from 'extensions/cache/Storage';

describe('extensions/cache/Storage', () => {
    let obj;

    beforeEach(() => {
        obj = new Storage();
    });

    describe('get()', () => {
        it('should return `null` if no item is found', () => {
            expect(obj.get('foo')).toBeNull();
        });

        it('should return a value if an item exists', () => {
            obj.set('foo', 123);

            expect(obj.get('foo')).toBe(123);
        });

        it('should return falsey values if an item exists', () => {
            obj.set('foo', false);

            expect(obj.get('foo')).toBe(false);

            obj.set('foo', '');

            expect(obj.get('foo')).toBe('');

            obj.set('foo', 0);

            expect(obj.get('foo')).toBe(0);
        });
    });

    describe('set()', () => {
        it('should set a value by key', () => {
            obj.set('bar', true);

            expect(obj.get('bar')).toBe(true);
        });

        it('should overwrite a previous value', () => {
            obj.set('bar', false);

            expect(obj.get('bar')).toBe(false);
        });
    });

    describe('has()', () => {
        it('should verify if an item exists', () => {
            obj.set('foo', 123);

            expect(obj.has('foo')).toBe(true);
            expect(obj.has('baz')).toBe(false);
        });
    });

    describe('remove()', () => {
        it('should remove an item by key', () => {
            obj.set('qux', [1]);

            expect(obj.get('qux')).toEqual([1]);

            obj.remove('qux');

            expect(obj.get('qux')).toBeNull();
        });
    });

    describe('flush()', () => {
        it('should remove all items', () => {
            obj.set('foo', 123);
            obj.set('bar', 456);

            expect(obj.has('foo')).toBe(true);
            expect(obj.has('bar')).toBe(true);

            obj.flush();

            expect(obj.has('foo')).toBe(false);
            expect(obj.has('bar')).toBe(false);
        });
    });
});
