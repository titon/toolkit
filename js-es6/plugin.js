/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import * as dom from 'libs/dom';
import * as obj from 'libs/object';

export default class Plugin {
    constructor(selector, options = {}) {
        this.initialize(selector, options);
        this.enable();
        this.startup();
    }

    /**
     * Destroy the plugin by disabling events, removing elements, and deleting the instance.
     */
    destroy() {
        this.emit('destroying');
        this.shutdown();
        this.disable();
        this.unmount();
        this.emit('destroyed');
    }

    /**
     * Disable the plugin and unbind any events.
     */
    disable() {
        if (this.enabled) {
            this.unbindEvents();
        }

        this.enabled = false;
    }

    /**
     * Enable the plugin and bind any events.
     */
    enable() {
        if (!this.enabled) {
            this.bindEvents();
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
     * Handles the initialization of the plugin by setting up members in the
     * correct order: options -> element(s) -> properties -> event bindings.
     *
     * The order is important as methods will require members from
     * the previous method to be initialized. This order *should not* change.
     *
     * @param {string} selector
     * @param {object} options
     */
    initialize(selector, options = {}) {
        this.selector = selector;
        this.initOptions(options);
        this.initElement(selector);
        this.initProperties();
        this.initBinds();
        this.emit('init');
    }

    /**
     * Initialize the customizable options by inheriting options from the
     * parent, the static options from the current class, and
     * finally merging with a custom set of options passed as an argument.
     *
     * @param {object} options
     */
    initOptions(options = {}) {
        this.options = obj.merge({}, super.getDefaultOptions() || {}, this.getDefaultOptions());
        this.setOptions(options);
    }

    /**
     * Initialize the primary element(s) by attempting to find it in the DOM
     * using the selector passed from the constructor.
     *
     * This method should be overridden for elements that are rendered
     * from templates.
     *
     * @param {string} selector
     */
    initElement(selector) {
        this.setElement(dom.find(selector));
    }

    /**
     * Initialize the class properties by setting to defaults that should be
     * usable by sub-classes. The following properties are set.
     *
     *      name {string}       Name of the plugin. Should match the `Toolkit.Name` declaration.
     *      version {string}    Current or last modified version of the plugin.
     *      cache {object}      Cached AJAX requests or data.
     *      enabled {bool}      Whether or not the plugin is enabled (events are bound).
     */
    initProperties() {
        this.name = 'Plugin';
        this.version = '3.0.0';
        this.cache = {};
        this.enabled = false;
    }

    /**
     * Initialize the DOM event bindings. By default, this sets no binds,
     * as binds should be unique per sub-class.
     */
    initBinds() {
    }

    /**
     * Mount (insert) the primary element into the DOM.
     */
    mount() {
        if (this.mounted) {
            return; // Already mounted
        }

        this.emit('mounting');
        // TODO
        this.emit('mounted');
        this.mounted = true;
    }

    /**
     * Method to be called when the plugin is destroyed and or removed from the DOM.
     * This method should be implemented in sub-classes to clean up and reset any state.
     */
    shutdown() {
    }

    /**
     * Method to be called when the plugin is instantiated and needs to be bootstrapped.
     * This method should be implemented in sub-classes to set the initial state.
     */
    startup() {
    }

    /**
     * Set the primary element to use within the plugin.
     *
     * @param {HTMLElement} element
     */
    setElement(element) {
        if (dom.isElement(element)) {
            this.element = element;
        }
    }

    /**
     * Set a collection of elements to use within the plugin.
     *
     * @param {array} elements
     */
    setElements(elements) {
        if (Array.isArray(elements)) {
            this.elements = elements; // We'll assume they are `HTMLElement`s
        }
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
        options = obj.merge(this.options, options);

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

    /**
     * Unmount (remove) the primary element from the DOM.
     */
    unmount() {
        if (!this.mounted) {
            return; // Most likely embedded
        }

        this.emit('unmounting');
        // TODO
        this.emit('unmounted');
        this.mounted = false;
    }

}

Plugin.uid = 0;

Plugin.options = {
    cache: true,
    debug: false
};
