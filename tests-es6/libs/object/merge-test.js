'use strict';

import merge from 'libs/object/merge';

describe('libs/object/merge', () => {
    describe('merge()', () => {
        it('should copy members into the base', () => {
            let base = { foo: 123 };

            merge(base, {
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

            merge(base, { bar: 'abc' }, { baz: true });

            expect(base).toEqual({
                foo: 123,
                bar: 'abc',
                baz: true
            });
        });

        it('should not copy to sources', () => {
            let source1 = { foo: 123 },
                source2 = { foo: 456, bar: 'abc' };

            let base = merge({}, source1, source2);

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

            merge(base, { foo: 456 }, { foo: 789 });

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

            merge(base, {
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
