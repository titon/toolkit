'use strict';

import profile from 'decorators/profile';

class ProfileStub {
    constructor() {
        this.value = null;
    }

    @profile
    method() {}

    @profile
    get getter() {
        return this.value;
    }

    @profile
    set setter(value) {
        this.value = value;
    }
}

describe('decorators/profile', () => {
    describe('profile()', () => {
        it('should wrap `get`, `set`, and `value` descriptors', () => {
            let info = console.info,
                obj = new ProfileStub(),
                messages = [];

            // Override `console.info()`
            console.info = function(message) {
                messages.push(message.trim());
            };

            expect(obj.value).toBe(null);

            obj.method();
            obj.setter = 123;
            let value = obj.getter;

            expect(value).toBe(123);

            messages.forEach(message => {
                expect(message).toMatch(/^(method|getter|setter)\(\) took [\d\.]+ milliseconds to run using the arguments:$/);
            });

            // Reset `console.info()`
            console.info = info;
        });
    });
});
