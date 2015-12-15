/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import flags from './ext/flags';

let Titon = window.Titon = {

    /** Current version. */
    version: '%version%',

    /** Build date hash. */
    build: '%build%',

    options: {
        namespace: '',          /** CSS namespace. */
        autoNamespace: true,
        debug: false,           /** Global debugging. */
    },

    /** Localization messages. */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /** Runtime flags. */
    flags
};

export default Titon;
