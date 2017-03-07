import { Adapter } from 'aesthetic';
import { TitonToolkit } from '../src/Titon';
import { aesthetic } from '../src/styler';

class StubAdapter extends Adapter {}

describe('Titon', () => {
  let toolkit;

  beforeEach(() => {
    toolkit = new TitonToolkit();
  });

  describe('debugging', () => {
    it('can turn on debug mode', () => {
      expect(toolkit.options.debug).toBe(false);

      toolkit.debug();

      expect(toolkit.options.debug).toBe(true);
    });
  });

  describe('logging', () => {
    it('can set a logger', () => {
      const func = () => {};

      expect(toolkit.logger).toBeNull();

      toolkit.setLogger(func);

      expect(toolkit.logger).toBe(func);
    });

    it('errors if logger is not a function', () => {
      expect(() => {
        toolkit.setLogger(123);
      }).toThrowError('Logger must be a function.');
    });

    it('logs a message to the logger', () => {
      const func = jest.fn();

      toolkit.setLogger(func);
      toolkit.log('Foo');

      expect(func).toBeCalledWith('Foo');

      toolkit.log('Foo', 1, 2, 3);

      expect(func).toBeCalledWith('Foo', 1, 2, 3);

      toolkit.log(new Error('Foo'), 1, 2, 3);

      expect(func).toBeCalledWith(new Error('Foo'), 1, 2, 3);
    });
  });

  describe('styling', () => {
    it('can customize the Aesthetic adapter', () => {
      const adapter = new StubAdapter();

      expect(aesthetic.adapter).not.toBe(adapter);

      toolkit.setAdapter(adapter);

      expect(aesthetic.adapter).toBe(adapter);
    });
  });
});
