/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Titon from '../Titon';
import assign from '../../node_modules/lodash/object/assign';
import bem from '../ext/utility/bem';
import classBuilder from '../ext/utility/classBuilder';
import generateUID from '../ext/utility/generateUID';
import '../poly/performance/now';

export default class Component extends React.Component {
    constructor() {
        super();

        this.state = {};
        this.version = '3.0.0';
    }

    /**
     * Re-bind the context for every supplied method.
     * Will automatically bind all methods that start with "on",
     * assuming they are event handlers.
     *
     * @param {...} methods
     */
    autoBind(...methods) {
        // Automatically inject all methods that start with "on"
        methods = methods.concat(
            Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(prop => {
                return (prop.substr(0, 2) === 'on' && typeof this[prop] === 'function');
            })
        );

        // Bind the functions
        methods.forEach(method => this[method] = this[method].bind(this));
    }

    /**
     * Emit an event and notify all listeners, as well as print debug information if enabled.
     *
     * @param {String} event
     * @param {Array} [args]
     */
    emitEvent(event, args = []) {
        let propName = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
            listeners = this.props[propName],
            debug = this.props.debug || Titon.options.debug;

        if (debug && window.console) {
            console.log(this.constructor.name + '#' + this.uid, performance.now().toFixed(3), event, ...args);

            if (debug === 'verbose') {
                console.dir(this);
            }
        }

        if (!listeners) {
            return;
        } else if (!Array.isArray(listeners)) {
            listeners = [listeners];
        }

        args.unshift(new TitonEvent(this.constructor.name, this.getUID(), event));

        listeners.forEach(func => func.apply(this, args));
    }

    /**
     * Generate a unique HTML class name based on the passed parameters.
     * Append the CSS namespace if applicable.
     *
     * @param {String} className
     * @param {...} [params]
     * @returns {String}
     */
    formatClass(className, ...params) {
        return classBuilder(bem(className), ...params);
    }

    /**
     * Generate a unique HTML ID based on the passed parameters.
     *
     * @param {...} params
     * @returns {String}
     */
    formatID(...params) {
        return ['titon', this.getUID(), ...params].join('-').trim();
    }

    /**
     * Generate a unique identifier for this instance.
     */
    generateUID() {
        this.uid = generateUID();
    }

    /**
     * Generate a new set of properties based on a specific property from the initial property set.
     * If the value is this property is an object, merge it in, else assume it's a boolean.
     *
     * @param {Object} props
     * @param {String} propName
     * @param {Boolean} [copyListeners]
     * @returns {Object}
     */
    generateNestedProps(props, propName, copyListeners = true) {
        let obj = {};

        // Merge nested object
        if (typeof props[propName] === 'object') {
            assign(obj, props[propName]);
            obj.enabled = true;
        } else {
            obj.enabled = Boolean(props[propName]);
        }

        // Inherit event listeners
        if (copyListeners) {
            Object.keys(props).forEach(key => {
                if (key.substr(0, 2) !== 'on') {
                    return;
                }

                if (!obj[key]) {
                    obj[key] = [];
                }

                if (Array.isArray(props[key])) {
                    obj[key] = obj[key].concat(props[key]);

                } else if (props[key]) {
                    obj[key].push(props[key]);
                }
            });
        }

        return obj;
    }

    /**
     * Return the UID for the current component.
     * The UID could either be inherited from the parent, or generate per instance.
     *
     * @returns {String}
     */
    getUID() {
        return this.context.uid || this.uid;
    }
}

class TitonEvent {
    constructor(name, uid, event) {
        this.uid = uid;
        this.type = event;
        this.component = name;
        this.timestamp = Date.now();
    }
}
