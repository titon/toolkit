/* eslint no-console: 0 */

import deprecated from '../../../src/ext/decorators/deprecated';

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

describe('ext/decorators/deprecated()', () => {
    it('should wrap `get`, `set`, and `value` descriptors', () => {
        let warn = console.warn,
            obj = new DeprecatedStub(),
            messages = [],
            value = null;

        // Override `console.warn()` temporarily
        console.warn = function(message) {
            messages.push(message);
        };

        expect(obj.value).toBe(null);

        obj.method();
        obj.setter = 123;
        value = obj.getter;

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
