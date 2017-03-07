import toArray from '../../src/utility/toArray';

describe('utility/toArray()', () => {
  it('converts non-array to array', () => {
    expect(toArray('foo')).toEqual(['foo']);
  });

  it('passes array as is', () => {
    expect(toArray(['foo', 'bar'])).toEqual(['foo', 'bar']);
  });
});
