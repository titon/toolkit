import generateUID from '../../src/utility/generateUID';

describe('utility/generateUID()', () => {
  it('should generate a random character string', () => {
    expect(generateUID()).toMatch(/^[a-z0-9]{6,12}$/);
  });

  it('should generate a unique ID', () => {
    expect(generateUID()).not.toBe(generateUID());
  });
});
