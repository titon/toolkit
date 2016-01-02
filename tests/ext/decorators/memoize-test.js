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

        setTimeout(function() {
            expect(obj.method()).toBe(now);
            done();
        }, 150);
    });

    it('should throw an error if arguments are used', () => {
        expect(() => obj.methodWithArgs(1, 2)).toThrow(new SyntaxError('The memoize() decorator does not support arguments for methodWithArgs().'));
    });
});
