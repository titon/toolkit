'use strict';

import deprecated from 'decorators/deprecated';

class DeprecatedStub {
    constructor() {
        this.value = null;
    }

    @deprecated('method')
    method() {}

    @deprecated('getter')
    get getter() {
        return this.value;
    }

    @deprecated('setter')
    set setter(value) {
        this.value = value;
    }
}

describe('decorators/deprecated', () => {
    describe('deprecated()', () => {
        it('should wrap `get`, `set`, and `value` descriptors', () => {
            let warn = console.warn,
                obj = new DeprecatedStub(),
                messages = [];

            // Override `console.warn()`
            console.warn = function (message) {
                messages.push(message);
            };

            expect(obj.value).toBe(null);

            obj.method();
            obj.setter = 123;
            let value = obj.getter;

            expect(value).toBe(123);
            expect(messages).toEqual([
                'method() is deprecated. method',
                'setter() is deprecated. setter',
                'getter() is deprecated. getter'
            ]);

            // Reset `console.warn()`
            console.warn = warn;
        });
    });
});
