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
        elementSeparator: '-',      // BEM element separator
        modifierSeparator: '--',    // BEM modifier separator

        namespace: '',              // CSS class namespace
        autoNamespace: true,        // Automatically prefix namespace to classes

        debug: false,               // Global debugging
        logger: function() {}       // Logger function that handles invariants
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
