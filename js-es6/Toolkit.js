/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import { isTouch, isRetina, isRTL } from 'libs/flags';

class Toolkit {

    /** Current version. */
    version = '%version%';

    /** Build date hash. */
    build = '%build%';

    /** CSS namespace. */
    namespace = '';

    /** ARIA support. */
    aria = true;

    /** Global debugging. */
    debug = false;

    /** Localization messages. */
    messages = {
        loading: 'Loading...',
        error: 'An error has occurred!'
    };

    /** Detect touch devices. */
    isTouch = isTouch;

    /** Detect retina displays. */
    isRetina = isRetina;

    /** Detect right-to-left support. */
    isRTL = isRTL;
}

export default window.Toolkit = new Toolkit();
