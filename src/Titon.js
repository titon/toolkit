/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import flags from './flags';

const Titon = Object.freeze({

    /** Current version. */
    version: '%version%',

    /** Build date hash. */
    build: '%build%',

    /** Configurable options. */
    options: {
        // BEM element separator
        elementSeparator: '-',

        // BEM modifier separator
        modifierSeparator: '--',

        // CSS class namespace
        namespace: '',

        // Automatically prefix namespace to classes
        autoNamespace: true,

        // Global debugging
        debug: false,

        // Logger function that handles invariants
        logger() {},

        // Style states
        states: ['info', 'debug', 'warning', 'error', 'success']
    },

    /** Localization messages. */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /** Runtime flags. */
    flags
});

window.Titon = Titon;

export default Titon;
