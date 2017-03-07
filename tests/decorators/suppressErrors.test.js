import suppressErrors from '../../src/decorators/suppressErrors';

class SuppressErrorsStub {
  uncaught() {
    throw new Error('Uncaught error.');
  }

  @suppressErrors
  caught() {
    throw new Error('Caught error.');
  }
}

describe('decorators/suppressErrors()', () => {
  it('should suppress and log all console messages', () => {
    const obj = new SuppressErrorsStub();

    expect(() => obj.uncaught()).toThrowError('Uncaught error.');
    expect(obj.caught()).toEqual(new Error('Caught error.'));
  });
});
