import formatInputName from '../../src/utility/formatInputName';

describe('utility/formatInputName()', () => {
  it('allows empty strings', () => {
    expect(formatInputName('')).toBe('');
  });

  it('trims spaces', () => {
    expect(formatInputName(' foo ')).toBe('foo');
  });

  it('removes unwanted characters', () => {
    expect(formatInputName('foo()bar')).toBe('foobar');
  });

  it('removes grouping characters', () => {
    expect(formatInputName('foo[]')).toBe('foo');
    expect(formatInputName('foo[bar]')).toBe('foo-bar');
    expect(formatInputName('foo[bar][]')).toBe('foo-bar');
    expect(formatInputName('foo[bar][baz]')).toBe('foo-bar-baz');
    expect(formatInputName('foo[][bar]')).toBe('foo-bar');
  });
});
