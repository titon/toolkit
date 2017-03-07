/* eslint max-nested-callbacks: 0 */

import throttle from '../../src/decorators/throttle';

class ThrottleStub {
  constructor() {
    this.with = 0;
    this.without = 0;
  }

  @throttle(25)
  withThrottle() {
    this.with += 1;
  }

  withoutThrottle() {
    this.without += 1;
  }
}

describe('decorators/throttle()', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should delay the execution of throttled functions', () => {
    const obj = new ThrottleStub();
    const t1 = setInterval(obj.withThrottle.bind(obj), 10);
    const t2 = setInterval(obj.withoutThrottle.bind(obj), 10);

    setTimeout(() => {
      clearInterval(t1);
      clearInterval(t2);

      // Give the throttle some timer to complete
      setTimeout(() => {
        expect(obj.with).toBe(5);
        expect(obj.without).toBe(10);
      }, 25);
    }, 50);
  });
});
