'use strict';

import chain from 'libs/utility/chain';

class ChainStub {
    noReturn() {}
    hasReturn() {
        return this;
    }
}

describe('libs/utility/chain', () => {
    describe('chain()', () => {
        let obj;

        beforeEach(() => obj = new ChainStub());

        it('should return undefined if the function has no return', () => {
            expect(obj.noReturn()).toBeUndefined();
            expect(obj.hasReturn()).toBe(obj);
        });

        it('should return the same instance if the function has no return', () => {
            obj.noReturn = chain(obj.noReturn);
            obj.hasReturn = chain(obj.hasReturn);

            expect(obj.noReturn()).toBe(obj);
            expect(obj.hasReturn()).toBe(obj);
        });
    });
});
