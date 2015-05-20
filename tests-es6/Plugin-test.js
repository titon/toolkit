'use strict';

import Plugin from 'Plugin';

describe('Plugin', () => {
    describe('constructor()', () => {
        it('should set class properties', () => {
            let obj = new Plugin();

            expect(obj.name).toBe('Plugin');
            expect(obj.enabled).toBe(false);
        });

        it('should increase the UID for each instance', () => {
            expect(Plugin.uid).toBe(0);

            let obj1 = new Plugin(),
                obj2 = new Plugin();

            expect(obj1.id).toBe(1);
            expect(obj2.id).toBe(2);
            expect(Plugin.uid).toBe(2);
        });
    });
});
