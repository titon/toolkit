/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import * as obj from "libs/object";

export default class Plugin {
    constructor(options = {}) {
        /** Name of the plugin. Must match the object declaration. */
        this.name = 'Plugin';

        /** Current or last modified version of the plugin. */
        this.version = '3.0.0';

        /** Cached data and requests. */
        this.cache = {};

        /** Is the plugin enabled? */
        this.enabled = false;

        /** Options inherited during instantiation. */
        this.options = {};

        // Initialize options
        this.setOptions(options);
    }

    /**
     * Method to be called when the plugin is destroyed and or removed from the DOM.
     * This method should clean up and reset any state.
     */
    destructor() {
    }

    /*--------------------- Properties ---------------------*/

    get cssClass() {
        return this.name.replace(/[A-Z]/g, function(match) {
            return ('-' + match.charAt(0).toLowerCase());
        }).slice(1);
    }

    get keyName() {
        return this.name.charAt(0).toLowerCase() + this.name.slice(1);
    }

    get uid() {
        return this.constructor.uid;
    }

    /*--------------------- Methods ---------------------*/

    /**
     * Disable the plugin and unbind any events.
     */
    disable() {
        if (this.enabled) {
            //this.bindEvents('off');
        }

        this.enabled = false;
    }

    /**
     * Enable the plugin and bind any events.
     */
    enable() {
        if (!this.enabled) {
            //this.bindEvents('on');
        }

        this.enabled = true;
    }

    /**
     * Return the static options defined on the class declaration.
     *
     * @returns {object}
     */
    getDefaultOptions() {
        return this.constructor.options;
    }

    /**
     * Set and customize the options on the class instance.
     * Should take into account the following steps when setting:
     *
     * - Merge with and inherit parent options
     * - Merge responsive options if the breakpoint matches
     * - Merge grouped options if the group matches
     *
     * @param {object} options
     */
    setOptions(options) {
        options = obj.merge({},
            super.getDefaultOptions() || {},
            this.getDefaultOptions(),
            options);

        // Inherit options based on responsive media queries
        if (options.responsive && window.matchMedia) {
            Object.keys(options.responsive).forEach(key => {
                let respOptions = options.responsive[key];

                if (matchMedia(respOptions.breakpoint).matches) {
                    obj.merge(options, respOptions);
                }
            });
        }

        // TODO - set hooks
        // TODO - option groups

        this.options = options;
    }
}

Plugin.uid = 0;

Plugin.options = {
    cache: true,
    debug: false
};
