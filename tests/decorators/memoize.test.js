import memoize from '../../src/decorators/memoize';

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

describe('decorators/memoize()', () => {
  let obj = null;

  beforeEach(() => {
    obj = new MemoizeStub();
  });

  it('should cache the result of a function', () => {
    const now = (new Date()).toUTCString();

    expect(obj.method()).toBe(now);
    expect(obj.method()).toBe(now);

    processInThread(() => {
      expect(obj.method()).toBe(now);
      expect(obj.method()).toBe(now);
    });
  });

  it('should cache functions with arguments', () => {
    expect(obj.methodWithArgs(5, 5)).toBe(10);

    processInThread(() => {
      expect(obj.methodWithArgs(5, 5)).toBe(10);
    });
  });
});
