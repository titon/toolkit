/* eslint max-nested-callbacks: 0 */

import debounce from '../../src/decorators/debounce';

class DebounceStub {
  constructor() {
    this.with = 0;
    this.without = 0;
  }

  @debounce(25)
  withDebounce() {
    this.with += 1;
  }

  withoutDebounce() {
    this.without += 1;
  }
}

describe('decorators/debounce()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay the execution of debounced functions', () => {
    const obj = new DebounceStub();
    const t1 = setInterval(obj.withDebounce.bind(obj), 10);
    const t2 = setInterval(obj.withoutDebounce.bind(obj), 10);

    setTimeout(() => {
      clearInterval(t1);
      clearInterval(t2);

      // Give the debounce some timer to complete
      setTimeout(() => {
        expect(obj.with).toBe(1);
        expect(obj.without).toBe(10);
      }, 25);
    }, 50);
  });
});
