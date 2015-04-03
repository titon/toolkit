/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Plugin from './plugin';

export default class Component extends Plugin {

    /**
    getClassName() {
        return this.name.replace(/[A-Z]/g, function(match) {
            return ('-' + match.charAt(0).toLowerCase());
        }).slice(1);
    }

    getID(...params) {
        params.unshift('toolkit', this.getClassName(), this.constructor.uid);

        return params.join('-');
    }*/

}
