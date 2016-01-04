import memoize from '../../../src/ext/decorators/memoize';

class MemoizeStub {
    @memoize
    method() {
        return (new Date()).toUTCString();
    }

    @memoize
    methodWithArgs(a, b) {
        return a + b;
    }
}

describe('ext/decorators/memoize', () => {
    let obj = null;

    beforeEach(() => {
        obj = new MemoizeStub();
    });

    it('should cache the result of a function', done => {
        let now = (new Date()).toUTCString();

        expect(obj.method()).toBe(now);
        expect(obj.method()).toBe(now);

        setTimeout(function() {
            expect(obj.method()).toBe(now);
            expect(obj.method()).toBe(now);
            done();
        }, 150);
    });

    it('should cache functions with arguments', done => {
        expect(obj.methodWithArgs(5, 5)).toBe(10);

        setTimeout(function() {
            expect(obj.methodWithArgs(5, 5)).toBe(10);
            done();
        }, 150);
    });
});
