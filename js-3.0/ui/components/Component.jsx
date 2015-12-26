/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Titon from '../../Titon';
import bem from '../../ext/utility/bem';
import classBuilder from '../../ext/utility/classBuilder';
import generateUID from '../../ext/utility/generateUID';
import '../../polyfills/performance/now';

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
        return ['titon', this.context.uid || this.uid, ...params].join('-').trim();
    }

    /**
     * Generate a unique identifier for this instance.
     */
    generateUID() {
        this.uid = generateUID();
    }
}
