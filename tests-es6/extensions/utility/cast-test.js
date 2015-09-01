'use strict';

import cast from 'extensions/utility/cast';

describe('extensions/utility/cast', () => {
    describe('cast()', () => {
        it('should return the casted value', () => {
            expect(cast('true')).toBe(true);
            expect(cast('false')).toBe(false);
            expect(cast('null')).toBe(null);
            expect(cast('123')).toBe(123);
            expect(cast('456.78')).toBe(456.78);
            expect(cast('foo')).toBe('foo');
        });
    });
});
