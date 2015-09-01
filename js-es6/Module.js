/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Titon from 'Titon';
import Element from 'Element';
import assign from 'lodash/object/assign';
import forOwn from 'lodash/object/forOwn';
import isPlainObject from 'lodash/lang/isPlainObject';
import delegate from 'extensions/event/delegate';
import isElement from 'extensions/dom/isElement';
import findID from 'extensions/dom/findID';
import uid from 'extensions/uid';
import { isTouch } from 'extensions/flags';
import 'polyfills/CustomEvent';

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
    baseOptions = {};

    /** The CSS selector used to find the primary element. */
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
     * @param {string|HTMLElement} element
     * @param {object} [options]
     * @param {boolean} [init]
     */
    constructor(element, options, init = true) {
        if (typeof element === 'string') {
            this.selector = element;
        }

        // Setup the class
        this.setupOptions(options);
        this.setupElement(element);
        this.setupProperties();
        this.setupBinds();

        // Increase UID
        this.uid = uid(this.name);

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
        let debug = this.options.debug || Titon.debug,
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
        this.element.element.dispatchEvent(new CustomEvent(event + '.titon.' + this.name.toLowerCase(), {
            detail: {
                context: this,
                arguments: args
            }
        }));
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
     * Destroy the module by unbinding events, removing elements, and deleting the instance.
     * The custom `shutdown()` method should be called first so that sub-classes can clean up.
     *
     * This method is the opposite of `initialize()`.
     */
    finalize() {
        this.emit('finalizing');
        this.shutdown();
        this.disable();
        this.unmount();
        this.emit('finalized');
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
     * This method is the opposite of `finalize()`.
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

        if (this.mounted || !element || element.element.parentNode) {
            return;
        }

        this.emit('mounting');
        this.mountTo(element.element);
        this.emit('mounted');

        this.mounted = true;
    }

    /**
     * Abstract method that does the actual DOM insertion. This allows for easy overrides.
     *
     * @param {HTMLElement} element
     */
    mountTo(element) {
        document.body.appendChild(element);
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
     * Handle and process JSON responses by automatically triggering a `callback` function.
     *
     * @param {object} json
     */
    processJSON(json) {
        if (json.callback) {
            var namespaces = json.callback.split('.'),
                func = window,
                context = func;

            namespaces.forEach(namespace => {
                context = func;
                func = func[namespace];
            });

            func.call(context, json);
        }

        this.emit('process.json', [json]);
    }

    /**
     * Method to be called when the state has changed and the DOM needs to be updated.
     * This method should be implemented in sub-classes and *must* be the only method that mutates the DOM.
     */
    render() {
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
        let bindings = [],
            mode = this.options.mode;

        if (mode === 'hover') {
            mode = isTouch ? 'click' : 'mouseenter';
        }

        forOwn(binds, (callback, key) => {
            let [event, context, selector] = key
                .replace('{mode}', mode)
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
     * @param {HTMLElement|Element} element
     */
    setElement(element) {
        if (isElement(element)) {
            element = new Element(element);
        }

        if (element instanceof Element) {
            this.element = element;

        } else {
            console.warn('Invalid element. Must be an instance of Titon `Element` or a DOM `HTMLElement`.');
        }
    }

    /**
     * Set and customize the options on the class instance.
     * Should take into account the following steps when setting:
     *
     * - Merge with and inherit parent options
     * - Merge responsive options if the breakpoint matches
     * - Bind listeners for options that start with "on"
     *
     * @param {object} options
     */
    setOptions(options) {
        options = assign({}, this.baseOptions, options || {});

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
     * @param {string|object|function} state
     * @param {*} [value]
     */
    setState(state, value) {
        if (typeof value !== 'undefined') {
            this.setState({
                [state]: value
            });

            return;
        }

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
     * using the selector passed from the constructor, or an element directly.
     * Once found, use `setElement()`.
     *
     * This method should be implemented by sub-classes.
     *
     * @param {string|HTMLElement|Element} element
     */
    setupElement(element) {
        if (typeof element === 'string') {
            element = findID(element); // Attempt to find it
        }

        if (element) {
            this.setElement(element);

        } else {
            console.warn('Element could not be found.');
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
        let baseOptions = {},
            parent = this.constructor;

        // Loop through each parent and merge in their options
        while (parent && typeof parent.prototype !== 'undefined') {
            baseOptions = assign({}, parent.prototype.getDefaultOptions(), baseOptions);
            parent = Object.getPrototypeOf(parent);
        }

        this.baseOptions = baseOptions;
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

        if (!this.mounted || !element || !element.element.parentNode) {
            return;
        }

        this.emit('unmounting');
        this.unmountFrom(element.element);
        this.emit('unmounted');

        this.mounted = false;
    }

    /**
     * Abstract method that does the actual DOM removal. This allows for easy overrides.
     *
     * @param {HTMLElement} element
     */
    unmountFrom(element) {
        element.parentNode.removeChild(element);
    }

}

Module.options = {
    cache: true,        // Whether to cache AJAX requests or not
    debug: false        // Whether to debug events or not
};
