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

    return this.count;
  }
}

describe('decorators/once()', () => {
  it('should only execute a method once', () => {
    const obj = new OnceStub();
    const value = obj.method();

    expect(obj.method()).toBe(value);
    expect(obj.method()).toBe(value);
    expect(obj.method()).toBe(value);
  });

  it('should only execute a handler once', () => {
    const obj = new OnceStub();
    const element = document.createElement('div');

    element.addEventListener('foo', obj.handler.bind(obj));

    expect(obj.count).toBe(0);

    element.dispatchEvent(new CustomEvent('foo'));
    element.dispatchEvent(new CustomEvent('foo'));
    element.dispatchEvent(new CustomEvent('foo'));

    expect(obj.count).toBe(1);
  });

  it('should pass the event to the original function', () => {
    const obj = new OnceStub();
    const element = document.createElement('div');

    element.addEventListener('bar', obj.handler.bind(obj));

    expect(obj.count).toBe(0);

    element.dispatchEvent(new CustomEvent('bar', { detail: { count: 5 } }));
    element.dispatchEvent(new CustomEvent('bar', { detail: { count: 10 } }));
    element.dispatchEvent(new CustomEvent('bar', { detail: { count: 15 } }));

    expect(obj.count).toBe(5);
  });
});
