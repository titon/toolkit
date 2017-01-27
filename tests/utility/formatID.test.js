import formatID from '../../src/utility/formatID';

describe('utility/formatID()', () => {
  it('accepts arbitray arguments', () => {
    expect(formatID('foo', 'bar')).toBe('titon-foo-bar');
  });

  it('trims spaces', () => {
    expect(formatID(' foo', 'bar ')).toBe('titon-foo-bar');
  });

  it('removes unwanted characters with dashes', () => {
    expect(formatID('foo()', '#bar', '""')).toBe('titon-foo-bar-');
  });
});
