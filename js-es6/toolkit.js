/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import { isTouch, isRetina, isRTL } from 'flags';
import Plugin from 'plugin';

let Toolkit = {

    /** Current version. */
    version: '%version%',

    /** Build date hash. */
    build: '%build%',

    /** CSS namespace. */
    namespace: '',

    /** ARIA support. */
    aria: true,

    /** Global debugging. */
    debug: false,

    /** Localization messages. */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /** BEM class name separators. */
    bemSeparators: ['-', '--'],

    /** Detect touch devices. */
    isTouch: isTouch,

    /** Detect retina displays. */
    isRetina: isRetina,

    /** Detect right-to-left support. */
    isRTL: isRTL,

    /**
     * Generate a BEM (block-element-modifier) valid CSS class name.
     *
     * @param {String} block
     * @param {String} [element]
     * @param {String} [modifier]
     * @returns {String}
     */
    bem: function(block, element, modifier) {
        var seps = Toolkit.bemSeparators;

        if (element) {
            block += seps[0] + element;
        }

        if (modifier) {
            block += seps[1] + modifier;
        }

        return Toolkit.namespace + block;
    }

};

Toolkit.Plugin = Plugin;
