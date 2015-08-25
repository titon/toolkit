/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import flags from 'extensions/flags';

let Titon = window.Titon = {

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

    /** Runtime flags. */
    flags: flags
};

export default Titon;
