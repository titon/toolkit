'use strict';

import isVisible from 'libs/dom/isVisible';

describe('libs/dom/isVisible', () => {
    describe('isVisible()', () => {
        it('should return `true` if the element is visible', () => {
            let element = document.createElement('div');

            document.body.appendChild(element);

            expect(isVisible(element)).toBe(true);

            element.style.visibility = 'hidden';

            expect(isVisible(element)).toBe(false);

            document.body.removeChild(element);
        });
    });
});
