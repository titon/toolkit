import Titon from '../../../src/Titon';
import formatBEM from '../../../src/ext/utility/formatBEM';

describe('ext/utility/formatBEM()', () => {
    it('should generate a class name', () => {
        expect(formatBEM('foo')).toBe('foo');
        expect(formatBEM('foo', 'bar')).toBe('foo-bar');
        expect(formatBEM('foo', 'bar', 'baz')).toBe('foo-bar--baz');
        expect(formatBEM('foo', '', 'baz')).toBe('foo--baz');
    });

    it('should generate a class name using arrays', () => {
        expect(formatBEM(['foo'])).toBe('foo');
        expect(formatBEM(['foo', 'bar'])).toBe('foo-bar');
        expect(formatBEM(['foo', 'bar', 'baz'])).toBe('foo-bar--baz');
        expect(formatBEM(['foo', '', 'baz'])).toBe('foo--baz');
    });

    it('should generate a class name using objects', () => {
        expect(formatBEM({ block: 'foo' })).toBe('foo');
        expect(formatBEM({ block: 'foo', element: 'bar' })).toBe('foo-bar');
        expect(formatBEM({ block: 'foo', element: 'bar', modifier: 'baz' })).toBe('foo-bar--baz');
        expect(formatBEM({ block: 'foo', element: '', modifier: 'baz' })).toBe('foo--baz');
    });

    it('should be able to customize separators', () => {
        Titon.options.elementSeparator = '__';
        Titon.options.modifierSeparator = '---';

        expect(formatBEM('foo')).toBe('foo');
        expect(formatBEM('foo', 'bar')).toBe('foo__bar');
        expect(formatBEM('foo', 'bar', 'baz')).toBe('foo__bar---baz');
        expect(formatBEM('foo', '', 'baz')).toBe('foo---baz');

        Titon.options.elementSeparator = '-';
        Titon.options.modifierSeparator = '--';
    });
});
