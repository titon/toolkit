import getter from '../../../src/ext/decorators/getter';

class GetterStub {
    constructor(data) {
        this.data = data;
    }

    @getter
    get(key) {
        let value = this.data[key];

        return (typeof value === 'undefined') ? null : value;
    }
}

describe('ext/decorators/getter()', () => {
    let obj = null;

    beforeEach(() => {
        obj = new GetterStub({
            foo: 123,
            bar: 'abc',
            baz: true
        });
    });

    it('should return a value defined by key', () => {
        expect(obj.get('foo')).toBe(123);
        expect(obj.get('baz')).toBe(true);
        expect(obj.get('qux')).toBe(null);
    });

    it('should return multiple values for an array of keys', () => {
        expect(obj.get(['bar', 'baz', 'qux', 'foo'])).toEqual({
            bar: 'abc',
            baz: true,
            qux: null,
            foo: 123
        });
    });
});
