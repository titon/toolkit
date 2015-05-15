'use strict';

import Toolkit from 'Toolkit';
import bem from 'libs/utility/bem';

describe('libs/utility/bem', () => {
    describe('bem()', () => {
        it('should generate a class name', () => {
            expect(bem('foo')).toBe('foo');
            expect(bem('foo', 'bar')).toBe('foo-bar');
            expect(bem('foo', 'bar', 'baz')).toBe('foo-bar--baz');
            expect(bem('foo', '', 'baz')).toBe('foo--baz');
        });

        it('should be able to customize separators', () => {
            bem.separators = ['__', '---'];

            expect(bem('foo')).toBe('foo');
            expect(bem('foo', 'bar')).toBe('foo__bar');
            expect(bem('foo', 'bar', 'baz')).toBe('foo__bar---baz');
            expect(bem('foo', '', 'baz')).toBe('foo---baz');

            bem.separators = ['-', '--'];
        });

        it('should prepend the `namespace`', () => {
            Toolkit.namespace = 'tk-';

            expect(bem('foo', 'bar')).toBe('tk-foo-bar');

            Toolkit.namespace = '';
        });
    });
});
