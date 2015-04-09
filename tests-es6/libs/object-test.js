'use strict';

import * as Obj from 'js-es6/libs/object';

describe('libs/object', () => {
    describe('forOwn()', () => {
        it('should loop over an object and execute a function', () => {
            let values = [],
                base = {
                    foo: 'abc',
                    bar: 123,
                    baz: true,
                    qux: [null]
                };

            Obj.forOwn(base, key => values.push(base[key]));

            expect(values).toEqual([
                'abc',
                123,
                true,
                [null]
            ]);
        });
    });

    describe('isObject()', () => {
        it('should return true if an object', () => {
            /*eslint no-new-object: 0*/

            expect(Obj.isObject({})).toBe(true);
            expect(Obj.isObject(new Object())).toBe(true);

            expect(Obj.isObject([])).toBe(false);
            expect(Obj.isObject('')).toBe(false);
        });
    });

    describe('merge()', () => {
        it('should copy members into the base', () => {
            let base = { foo: 123 };

            Obj.merge(base, {
                foo: 456,
                bar: 'abc'
            });

            expect(base).toEqual({
                foo: 456,
                bar: 'abc'
            });
        });

        it('should copy members from multiple sources', () => {
            let base = { foo: 123 };

            Obj.merge(base, { bar: 'abc' }, { baz: true });

            expect(base).toEqual({
                foo: 123,
                bar: 'abc',
                baz: true
            });
        });

        it('should not copy to sources', () => {
            let source1 = { foo: 123 },
                source2 = { foo: 456, bar: 'abc' };

            let base = Obj.merge({}, source1, source2);

            expect(base).toEqual({
                foo: 456,
                bar: 'abc'
            });

            expect(source1).toEqual({
                foo: 123
            });

            expect(source2).toEqual({
                foo: 456,
                bar: 'abc'
            });
        });

        it('should overwrite from multiple sources', () => {
            let base = { foo: 123 };

            Obj.merge(base, { foo: 456 }, { foo: 789 });

            expect(base).toEqual({
                foo: 789
            });
        });

        it('should merge nested objects', () => {
            let base = {
                foo: 123,
                bar: {
                    baz: 'abc',
                    qux: [4, 5, 6]
                }
            };

            Obj.merge(base, {
                bar: {
                    qux: [7, 8, 9]
                }
            });

            expect(base).toEqual({
                foo: 123,
                bar: {
                    baz: 'abc',
                    qux: [7, 8, 9]
                }
            });
        });
    });
});
