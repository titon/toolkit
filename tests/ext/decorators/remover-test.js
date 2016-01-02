import remover from '../../../src/ext/decorators/remover';

class RemoverStub {
    constructor(data) {
        this.data = data;
    }

    @remover
    remove(key) {
        delete this.data[key];
    }
}

describe('ext/decorators/remover()', () => {
    let obj = null;

    beforeEach(() => {
        obj = new RemoverStub({
            foo: 123,
            bar: 'abc',
            baz: true
        });
    });

    it('should remove a value defined by key', () => {
        obj.remove('foo');

        expect(obj.data).toEqual({
            bar: 'abc',
            baz: true
        });
    });

    it('should remove multiple values for an array of keys', () => {
        obj.remove(['foo', 'baz']);

        expect(obj.data).toEqual({
            bar: 'abc'
        });
    });
});
