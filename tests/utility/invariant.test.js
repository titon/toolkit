import Titon from '../../src/Titon';
import invariant from '../../src/utility/invariant';

describe('utility/invariant()', () => {
  it('returns true if condition is true', () => {
    expect(() => {
      expect(invariant(true, 'No message will be thrown.')).toBe(true);
    }).not.toThrow();
  });

  it('errors if no message', () => {
    expect(() => {
      invariant(false);
    }).toThrowError('`invariant()` requires an error message.');
  });

  it('errors with message if condition is false', () => {
    expect(() => {
      invariant(false, 'Custom error message.');
    }).toThrowError('Custom error message.');
  });

  it('errors with an interpolated message', () => {
    const error = new Error('Custom error message: foo bar.');
    error.name = 'Invariant Violation';

    expect(() => {
      invariant(false, 'Custom error message: %s %s.', 'foo', 'bar');
    }).toThrowError(error);
  });

  it('doesnt throw when in production', () => {
    expect(() => {
      runInProduction(() => {
        invariant(false, 'Will throw.');
      });
    }).not.toThrow();
  });

  it('logs error in production', () => {
    expect(() => {
      const spy = jest.fn();
      Titon.setLogger(spy);

      runInProduction(() => {
        invariant(false, 'Will throw.');
      });

      const error = new Error('Will throw.');
      error.name = 'Invariant Violation';

      expect(spy).toHaveBeenCalledWith(error);
    }).not.toThrow();
  });
});
