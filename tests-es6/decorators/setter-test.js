'use strict';

import setter from 'decorators/setter';

class SetterStub {
    constructor(data) {
        this.data = data;
    }

    get(key) {
        let value = this.data[key];

        return (typeof value === 'undefined') ? null : value;
    }

    @setter
    set(key, value) {
        this.data[key] = value;
    }
}

describe('decorators/setter', () => {
    describe('setter()', () => {
        let obj;

        beforeEach(() => {
            obj = new SetterStub({
                foo: 123,
                bar: 'abc',
                baz: true
            });
        });

        it('should set a value defined by key', () => {
            expect(obj.get('foo')).toBe(123);

            obj.set('foo', 456);

            expect(obj.get('foo')).toBe(456);
        });

        it('should set multiple values if the key is an object', () => {
            expect(obj.get('bar')).toBe('abc');
            expect(obj.get('qux')).toBe(null);

            obj.set({
                bar: 'xyz',
                qux: [1, 2, 3]
            });

            expect(obj.get('bar')).toBe('xyz');
            expect(obj.get('qux')).toEqual([1, 2, 3]);
        });
    });
});
