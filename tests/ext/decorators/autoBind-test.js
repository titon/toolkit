import autoBind from '../../../src/ext/decorators/autoBind';

class AutoBindMethodStub {
    constructor() {
        this.with = false;
        this.without = false;
    }

    @autoBind
    withBind() {
        this.with = true;
    }

    @autoBind
    withBindAndArgs(...args) {
        this.with = args;
    }

    withoutBind() {
        this.without = true;
    }
}

@autoBind
class AutoBindClassStub {
    constructor() {
        this.called = [];
    }

    method() {
        if (this.called) {
            this.called.push('method');
        }
    }

    onMethod() {
        this.called.push('onMethod');
    }

    handleMethod() {
        this.called.push('handleMethod');
    }
}

describe('ext/decorators/autoBind()', () => {
    it('should automatically set the context', done => {
        let obj = new AutoBindMethodStub();

        processInThread(obj.withoutBind);
        processInThread(obj.withBind);

        setTimeout(() => {
            expect(obj.with).toBe(true);
            expect(obj.without).toBe(false);
            done();
        }, 50);
    });

    it('should not modify other objects', done => {
        let obj1 = new AutoBindMethodStub(),
            obj2 = new AutoBindMethodStub();

        processInThread(obj1.withBind);

        setTimeout(() => {
            expect(obj1.with).toBe(true);
            expect(obj2.with).toBe(false);
            done();
        }, 50);
    });

    it('should pass along arguments', done => {
        let obj = new AutoBindMethodStub();

        processInThread(() => {
            obj.withBindAndArgs('foo', 123);
        });

        setTimeout(() => {
            expect(obj.with).toEqual(['foo', 123]);
            done();
        }, 50);
    });

    it('should automatic set the context for class methods that start with "on" or "handle"', done => {
        let obj = new AutoBindClassStub();

        processInThread(obj.method);
        processInThread(obj.onMethod);
        processInThread(obj.handleMethod);

        setTimeout(() => {
            expect(obj.called).toEqual(['onMethod', 'handleMethod']);

            obj.method();

            expect(obj.called).toEqual(['onMethod', 'handleMethod', 'method']);

            done();
        }, 50);
    });

    it('should not modify other objects when using on the class', done => {
        let obj1 = new AutoBindClassStub(),
            obj2 = new AutoBindClassStub();

        processInThread(obj1.onMethod);
        processInThread(obj2.handleMethod);

        setTimeout(() => {
            expect(obj1.called).toEqual(['onMethod']);
            expect(obj2.called).toEqual(['handleMethod']);
            done();
        }, 50);
    });
});
