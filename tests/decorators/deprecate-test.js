/* eslint no-console: 0 */

import deprecate from '../../src/decorators/deprecate';

class DeprecatedStub {
    constructor() {
        this.value = null;
    }

    @deprecate('method')
    method() {}

    @deprecate('getter')
    get getter() {
        return this.value;
    }

    @deprecate('setter')
    set setter(value) {
        this.value = value;
    }
}

describe('decorators/deprecate()', () => {
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
            'DeprecatedStub#method() is deprecated. method',
            'DeprecatedStub#setter() is deprecated. setter',
            'DeprecatedStub#getter() is deprecated. getter'
        ]);

        // Reset `console.warn()`
        console.warn = warn;
    });
});
