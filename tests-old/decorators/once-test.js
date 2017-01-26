import once from '../../src/decorators/once';

class OnceStub {
    constructor() {
        this.count = 0;
    }

    @once
    method() {
        return Date.now();
    }

    @once
    handler(e) {
        this.count += (e.detail ? e.detail.count : 1);
    }
}

describe('decorators/once()', () => {
    it('should only execute a method once', () => {
        let obj = new OnceStub(),
            value = obj.method();

        expect(obj.method()).toBe(value);
        expect(obj.method()).toBe(value);
        expect(obj.method()).toBe(value);
    });

    it('should only execute a handler once', () => {
        let obj = new OnceStub(),
            element = createElement('div');

        element.addEventListener('foo', obj.handler.bind(obj));

        expect(obj.count).toBe(0);

        element.dispatchEvent(new CustomEvent('foo'));
        element.dispatchEvent(new CustomEvent('foo'));
        element.dispatchEvent(new CustomEvent('foo'));

        expect(obj.count).toBe(1);

        element.cleanup();
    });

    it('should pass the event to the original function', () => {
        let obj = new OnceStub(),
            element = createElement('div');

        element.addEventListener('bar', obj.handler.bind(obj));

        expect(obj.count).toBe(0);

        element.dispatchEvent(new CustomEvent('bar', { detail: { count: 5 } }));
        element.dispatchEvent(new CustomEvent('bar', { detail: { count: 10 } }));
        element.dispatchEvent(new CustomEvent('bar', { detail: { count: 15 } }));

        expect(obj.count).toBe(5);

        element.cleanup();
    });
});
