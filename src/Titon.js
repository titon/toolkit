/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import flags from './flags';

const Titon = Object.freeze({

    /** Build date hash. */
    build: '%build%',

    /** Runtime flags. */
    flags,

    /** Localization messages. */
    messages: {
        error: 'An error has occurred!',
        loading: 'Loading...'
    },

    /** Configurable options. */
    options: {
        // Automatically prefix namespace to classes
        autoNamespace: true,

        // Prefix prepended to every cookie
        cookiePrefix: 'titon.',

        // Global debugging
        debug: false,

        // BEM element separator
        elementSeparator: '-',

        // Logger function that handles invariants
        logger() {},

        // BEM modifier separator
        modifierSeparator: '--',

        // CSS class namespace
        namespace: '',

        // Style states
        states: ['info', 'debug', 'warning', 'error', 'success']
    },

    /** Current version. */
    version: '%version%'
});

if (window) {
    window.Titon = Titon;
}

export default Titon;
