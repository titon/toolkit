import bind from '../../src/decorators/bind';

class BindMethodStub {
  constructor() {
    this.with = false;
    this.without = false;
  }

  @bind
  withBind() {
    this.with = true;
  }

  @bind
  withBindAndArgs(...args) {
    this.with = args;
  }

  withoutBind() {
    this.without = true;
  }
}

@bind
class BindClassStub {
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

describe('decorators/bind()', () => {
  it('should automatically set the context', () => {
    const obj = new BindMethodStub();

    processInThread(obj.withoutBind);
    processInThread(obj.withBind);
    processInThread(() => {
      expect(obj.with).toBe(true);
      expect(obj.without).toBe(false);
    });
  });

  it('should not modify other objects', () => {
    const obj1 = new BindMethodStub();
    const obj2 = new BindMethodStub();

    processInThread(obj1.withBind);
    processInThread(() => {
      expect(obj1.with).toBe(true);
      expect(obj2.with).toBe(false);
    });
  });

  it('should pass along arguments', () => {
    const obj = new BindMethodStub();

    processInThread(() => {
      obj.withBindAndArgs('foo', 123);
    });
    processInThread(() => {
      expect(obj.with).toEqual(['foo', 123]);
    });
  });

  it('should automatic set the context for class methods that start with "on" or "handle"', () => {
    const obj = new BindClassStub();

    processInThread(obj.method);
    processInThread(obj.onMethod);
    processInThread(obj.handleMethod);
    processInThread(() => {
      expect(obj.called).toEqual(['onMethod', 'handleMethod']);

      obj.method();

      expect(obj.called).toEqual(['onMethod', 'handleMethod', 'method']);
    });
  });

  it('should not modify other objects when using on the class', () => {
    const obj1 = new BindClassStub();
    const obj2 = new BindClassStub();

    processInThread(obj1.onMethod);
    processInThread(obj2.handleMethod);
    processInThread(() => {
      expect(obj1.called).toEqual(['onMethod']);
      expect(obj2.called).toEqual(['handleMethod']);
    });
  });
});
