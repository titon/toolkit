'use strict';

import * as Util from 'js-es6/libs/util';

class ChainStub {
    noReturn() {}

    hasReturn() {
        return this;
    }
}

class GetSetStub {
    constructor(data = {}) {
        this.data = data;
    }

    get(key) {
        let value = this.data[key];

        return (typeof value === 'undefined') ? null : value;
    }

    set(key, value) {
        this.data[key] = value;
    }
}

describe('libs/util', () => {
    describe('bound()', () => {
        it('should return the same number if between bounds', () => {
            expect(Util.bound(10, 15, 5)).toBe(10);
        });

        it('should return the minimum if greater than or equal to the maximum', () => {
            expect(Util.bound(20, 15, 5)).toBe(5);
            expect(Util.bound(15, 15, 5)).toBe(5);
        });

        it('should return the maximum - 1 when less than the minimum', () => {
            expect(Util.bound(1, 15, 5)).toBe(14);
            expect(Util.bound(4, 15, 5)).toBe(14);
            expect(Util.bound(5, 15, 5)).toBe(5);
        });
    });

    describe('chain()', () => {
        let chainObj;

        beforeEach(() => chainObj = new ChainStub());

        it('should return undefined if the function has no return', () => {
            expect(chainObj.noReturn()).toBeUndefined();
            expect(chainObj.hasReturn()).toBe(chainObj);
        });

        it('should return the same instance if the function has no return', () => {
            chainObj.noReturn = Util.chain(chainObj.noReturn);
            chainObj.hasReturn = Util.chain(chainObj.hasReturn);

            expect(chainObj.noReturn()).toBe(chainObj);
            expect(chainObj.hasReturn()).toBe(chainObj);
        });
    });

    describe('getter()', () => {
        let getterObj;

        beforeEach(() => {
            getterObj = new GetSetStub({
                foo: 123,
                bar: 'abc',
                baz: true
            });
            getterObj.get = Util.getter(getterObj.get);
        });

        it('should return a value defined by key', () => {
            expect(getterObj.get('foo')).toBe(123);
            expect(getterObj.get('baz')).toBe(true);
            expect(getterObj.get('qux')).toBe(null);
        });

        it('should return multiple values for an array of keys', () => {
            expect(getterObj.get(['bar', 'baz', 'qux', 'foo'])).toEqual({
                bar: 'abc',
                baz: true,
                qux: null,
                foo: 123
            });
        });
    });

    describe('setter()', () => {
        let setterObj;

        beforeEach(() => {
            setterObj = new GetSetStub({
                foo: 123,
                bar: 'abc',
                baz: true
            });
            setterObj.set = Util.setter(setterObj.set);
        });

        it('should set a value defined by key', () => {
            expect(setterObj.get('foo')).toBe(123);

            setterObj.set('foo', 456);

            expect(setterObj.get('foo')).toBe(456);
        });

        it('should set multiple values if the key is an object', () => {
            expect(setterObj.get('bar')).toBe('abc');
            expect(setterObj.get('qux')).toBe(null);

            setterObj.set({
                bar: 'xyz',
                qux: [1, 2, 3]
            });

            expect(setterObj.get('bar')).toBe('xyz');
            expect(setterObj.get('qux')).toEqual([1, 2, 3]);
        });
    });
});
