/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import assign from 'lodash/object/assign';
import forOwn from 'lodash/object/forOwn';
import isPlainObject from 'lodash/lang/isPlainObject';
import delegate from 'libs/event/delegate';

let uidCounts = {
    inc(name) {
        let value = this[name] || 0;

        return this[name] = value += 1;
    }
};

export default class Module {

    /** Map of DOM event bindings. */
    binds = [];

    /** Map of cached AJAX requests or data. */
    cache = {};

    /** The element bound to the module. */
    element = null;

    /** Whether or not the module is enabled (events are bound). */
    enabled = false;

    /** Map of event listeners to emit. */
    listeners = {};

    /** Whether or not the module is mounted in the DOM. */
    mounted = false;

    /** Name of the module. Should match the class name declaration. */
    name = 'Module';

    /** Unique configurable options for the module. */
    options = {};

    /** The CSS selector bound to the module. */
    selector = '';

    /** Current and previous state of the module. Must be modified with `setState()`. */
    state = {};
    previousState = {};

    /** Unique ID of this instance. */
    uid = 0;

    /** Current and last modified version of the module. */
    version = '3.0.0';

    /**
     * Handles the initialization of the module by setting up members in the
     * correct order: options -> element(s) -> properties -> event bindings.
     *
     * The order is important as methods will require members from
     * the previous method to be initialized. This order *must not* change.
     *
     * @param {string} selector
     * @param {object} [options]
     * @param {boolean} [init]
     */
    constructor(selector, options, init = true) {
        this.selector = selector;

        // Setup the class
        this.setupOptions(options);
        this.setupElement(selector);
        this.setupProperties();
        this.setupBinds();

        // Increase UID
        this.uid = uidCounts.inc(this.name);

        // Automatic initialization
        if (init) {
            this.initialize();
        }
    }

    /**
     * Loop through the event bindings and attach events to the specified selector in the correct context.
     * Take into account window, document, and delegation.
     *
     * @param {string} type
     */
    bindEvents(type) {
        let event,
            context,
            callback,
            selector,
            method = (type === 'on') ? 'addEventListener' : 'removeEventListener';

        this.binds.forEach(bind => {
            event = bind[0];
            context = bind[1];
            selector = bind[2];
            callback = bind[3];

            // Determine the correct context
            if (context === 'window') {
                context = window;
            } else if (context === 'document') {
                context = document;
            } else {
                context = this[context];
            }

            // Apply event delegation
            if (selector) {
                callback = delegate(selector, callback);
            }

            context[method](event, callback);
        });
    }

    /**
     * Destroy the module by unbinding events, removing elements, and deleting the instance.
     * The custom `shutdown()` method should be called first so that sub-classes can clean up.
     *
     * This method is the opposite of `initialize()`.
     */
    destroy() {
        this.emit('destroying');
        this.shutdown();
        this.disable();
        this.unmount();
        this.emit('destroyed');
    }

    /**
     * Disable the module and unbind any events.
     */
    disable() {
        if (this.enabled) {
            this.bindEvents('off');
        }

        this.enabled = false;
    }

    /**
     * Emit an event and notify all listeners, as well as print debug information
     * if enabled. If a primary element is set, also trigger a DOM event.
     *
     * @param {string} event
     * @param {Array} [args]
     */
    emit(event, args = []) {
        let debug = this.options.debug || Toolkit.debug,
            element = this.element,
            listeners = this.listeners[event];

        // Log debug information
        if (debug && window.console) {
            console.log(this.name + '#' + this.uid, new Date().getMilliseconds(), event, args);

            if (debug === 'verbose') {
                console.dir(this);
            }
        }

        // Notify module listeners
        if (listeners) {
            listeners.forEach(listener => listener.apply(this, args));
        }

        // Notify DOM listeners
        // IE<=9 do not support CustomEvent
        if (element && window.CustomEvent) {
            element.dispatchEvent(new CustomEvent(event + '.toolkit.' + this.name.toLowerCase(), {
                detail: {
                    context: this,
                    arguments: args
                }
            }));
        }
    }

    /**
     * Enable the module and bind any events.
     */
    enable() {
        if (!this.enabled) {
            this.bindEvents('on');
        }

        this.enabled = true;
    }

    /**
     * Return the static options defined on the class declaration.
     *
     * @returns {object}
     */
    getDefaultOptions() {
        return Module.options;
    }

    /**
     * Further initialize the module by mounting the element (if not mounted already),
     * binding DOM events, and triggering the custom `startup()` method.
     *
     * This method is the opposite of `destroy()`.
     */
    initialize() {
        this.emit('initializing');
        this.mount();
        this.enable();
        this.startup();
        this.emit('initialized');
    }

    /**
     * Mount (insert) the primary element into the DOM if it has not been already.
     */
    mount() {
        let element = this.element;

        if (this.mounted || !element || element.parentNode) {
            return;
        }

        this.emit('mounting');

        document.body.appendChild(element);

        this.emit('mounted');

        this.mounted = true;
    }

    /**
     * Subscribe to an event using a defined callback function.
     * The callback can either be a function or an array of functions.
     *
     * @param {string} event
     * @param {function|function[]} callbacks
     */
    on(event, callbacks) {
        if (!Array.isArray(callbacks)) {
            callbacks = [callbacks];
        }

        this.listeners[event] = (this.listeners[event] || []).concat(callbacks);
    }

    /**
     * Unsubscribe from an event in which the callback matches a defined listener.
     * If no callback is passed, unsubscribe all listeners.
     *
     * @param {string} event
     * @param {Function} [callback]
     */
    off(event, callback) {
        if (!callback) {
            delete this.listeners[event];
            return;
        }

        let listeners = this.listeners[event];

        if (listeners) {
            listeners.forEach((listener, i) => {
                if (listener === callback) {
                    listeners = listeners.splice(i, 1);
                }
            });
        }
    }

    /**
     * Method to be called when the module is destroyed and or removed from the DOM.
     * This method should be implemented in sub-classes to clean up and reset any state.
     */
    shutdown() {
    }

    /**
     * Method to be called when the module is instantiated and needs to be bootstrapped.
     * This method should be implemented in sub-classes to set the initial state.
     */
    startup() {
    }

    /**
     * Method to be called when the state has changed and the DOM needs to be updated.
     * This method should be implemented in sub-classes and *must* be the only method that mutates the DOM.
     */
    render() {
    }

    /**
     * Set a mapping of DOM events to bind to the primary element. The function
     * can either be a string for a name of a method on the current module,
     * or a literal function.
     *
     * Bindings support the following formats:
     *
     *      EVENT CONTEXT[ DELEGATE]: FUNC | [FUNC, FUNC]
     *
     * The selector is optional and is used for delegation.
     *
     * @param {object} binds
     */
    setBinds(binds) {
        let bindings = [];

        forOwn(binds, (callback, key) => {
            let [event, context, selector] = key
                    .replace('{mode}', this.options.mode)
                    .replace('{selector}', this.selector)
                    .split(' ', 3);

            // Find and bind the function
            if (typeof callback === 'string') {
                callback = this[callback].bind(this);
            }

            // Alter custom event names
            if (event === 'ready') {
                event = 'DOMContentLoaded';
            }

            bindings.push([event, context, selector || '', callback]);
        });

        this.binds = bindings;
    }

    /**
     * Set the primary element to use within the module.
     *
     * @param {Element} element
     */
    setElement(element) {
        this.element = element;
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
        options = assign(this.options, options || {});

        // Inherit options based on responsive media queries
        if (options.responsive && window.matchMedia) {
            forOwn(options.responsive, respOptions => {
                if (matchMedia(respOptions.breakpoint).matches) {
                    assign(options, respOptions);
                }
            });
        }

        // Auto-subscribe listeners that start with `on`
        forOwn(options, (value, key) => {
            if (key.match(/^on[A-Z]/)) {
                this.on(key.substr(2).toLowerCase(), value);
                delete options[key];
            }
        });

        // TODO - option groups

        this.options = options;
    }

    /**
     * A module should only represent a single state at any given time.
     * To modify the state, this method can be used, which accepts an object of values,
     * or a function that returns an object.
     *
     * The object passed (the possible new state), will then be compared against
     * the previous state using a diffing algorithm. If there are no changes,
     * nothing will occur.
     *
     * If there are changes, `changed` and `changed:*` events will be emitted,
     * the new state will be set, and the `render()` method will be called.
     *
     * @param {object|function} state
     */
    setState(state) {
        let currentState = this.state,
            changed = false,
            diff = {};

        // If state is a function, extract the object
        if (typeof state === 'function') {
            state = state.call(this, currentState);
        }

        // Exit early if not an object
        if (!isPlainObject(state)) {
            return;
        }

        // Determine if the state has changed by diffing:
        // - Doesn't exist in the current state
        // - Doesn't match the current state
        forOwn(state, (value, key) => {
            if (!(key in currentState) || value !== currentState[key]) {
                diff[key] = value;
                changed = true;
            }
        });

        // Exit early if no changes
        if (!changed) {
            return;
        }

        // Emit change events
        this.emit('changed', [diff, state, currentState]);

        forOwn(diff, (value, key) => {
            this.emit('changed:' + key, [diff[key], currentState[key] || null]);
        });

        // Set the new state and preserve the old one
        this.previousState = currentState;
        this.state = assign({}, currentState, diff);

        // Render the changes and update the DOM
        this.render();
    }

    /**
     * Setup DOM event bindings using `setBinds()`. By default, this sets no binds,
     * as binds should be unique per sub-class.
     */
    setupBinds() {
    }

    /**
     * Setup the primary element(s) by attempting to find it in the DOM
     * using the selector passed from the constructor. Once found, use `setElement()`.
     *
     * This method should be implemented by sub-classes.
     *
     * @param {string} selector
     */
    setupElement(selector) {
        if (selector) {
            console.warn(`No element defined for ${this.name}. Please use the \`${selector}\` selector.`);
        }
    }

    /**
     * Setup the customizable options by inheriting options from the
     * parent, the static options from the current class, and
     * finally merging with a custom set of options passed as an argument.
     *
     * @param {object} [options]
     */
    setupOptions(options) {
        let parentOptions = {},
            parent = Object.getPrototypeOf(this.constructor);

        // I have yet to find a *real* way to check if a class has a `super`.
        // Since we can't actually use `super.getDefaultOptions()` here.
        if (typeof parent.prototype !== 'undefined') {
            parentOptions = parent.prototype.getDefaultOptions.call(null, options);
        }

        this.options = assign({}, parentOptions, this.getDefaultOptions());
        this.setOptions(options);
    }

    /**
     * Setup dynamic class properties.
     */
    setupProperties() {
    }

    /**
     * Unmount (remove) the primary element from the DOM.
     */
    unmount() {
        let element = this.element;

        if (!this.mounted || !element || !element.parentNode) {
            return;
        }

        this.emit('unmounting');

        element.parentNode.removeChild(element);

        this.emit('unmounted');

        this.mounted = false;
    }

}

Module.options = {
    cache: true,
    debug: false
};

Toolkit.Module = Module;
