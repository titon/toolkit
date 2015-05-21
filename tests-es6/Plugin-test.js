'use strict';

import Plugin from 'Plugin';

describe('Plugin', () => {
    describe('constructor()', () => {
        it('should increase the count/UID for each instance', () => {
            expect(Plugin.count).toBe(0);

            let obj1 = new Plugin(),
                obj2 = new Plugin();

            expect(obj1.uid).toBe(1);
            expect(obj2.uid).toBe(2);
            expect(Plugin.count).toBe(2);
        });

        it('should set class properties', () => {
            let obj = new Plugin();

            expect(obj.name).toBe('Plugin');
            expect(obj.enabled).toBe(false);
        });
    });
});
