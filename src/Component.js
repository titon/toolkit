/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Titon from './Titon';
import ClassBuilder from './utility/ClassBuilder';
import assign from 'lodash/assign';
import cssClass from './prop-types/cssClass';
import generateUID from './utility/generateUID';
import omit from 'lodash/omit';
import wrapFunctions from './utility/wrapFunctions';
import './polyfills/Performance.now.js';

export default class Component extends React.Component {
    static defaultProps = {
        debug: false
    };

    static propTypes = {
        debug: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        uniqueClassName: cssClass
    };

    state = {};
    version = '3.0.0';

    /**
     * Emit a custom event and notify all listeners defined on the prop of the same name.
     * If the `debug` property is enabled, print out helpful information.
     *
     * This *must not* be used for native DOM events, use `handleEvent()` instead.
     *
     * @param {String} type
     * @param {*[]} [args]
     */
    emitEvent(type, args = []) {
        let debug = this.props.debug || Titon.options.debug,
            name = this.constructor.name,
            uid = this.getUID();

        if (debug && window.console) {
            /* eslint no-console: 0 */

            console.log(name + '#' + uid, performance.now().toFixed(3), type, ...args);

            if (debug === 'verbose') {
                console.dir(this);
            }
        }

        args.unshift({
            uid,
            type,
            component: name,
            timestamp: Date.now()
        });

        this.notifyEventListeners(type, args);
    }

    /**
     * Format a unique HTML class name based on the passed parameters.
     * The primary class name passed will automatically be namespaced,
     * while all other classes will not.
     *
     * @param {String|Array|Object} className
     * @param {...String|Array|Object} params
     * @returns {String}
     */
    formatClass(className, ...params) {
        if (!className) {
            return '';
        }

        let namespace = Titon.options.autoNamespace ? Titon.options.namespace : '',
            builder = new ClassBuilder(className, namespace);

        // Append additional classes
        params.forEach(param => {
            if (typeof param === 'string' || Array.isArray(param)) {
                builder.add(param);

            } else if (typeof param === 'object') {
                if (param.block) {
                    builder.add(param);

                } else {
                    builder.map(param);
                }
            }
        });

        // A special edge case here that should only apply to top-level components
        if (typeof this.props.uniqueClassName !== 'undefined') {
            builder.add(this.props.uniqueClassName, '', '', false);
        }

        return builder.toString();
    }

    /**
     * Format a unique HTML ID based on the passed parameters.
     *
     * @param {...String} params
     * @returns {String}
     */
    formatID(...params) {
        return ['titon', this.getUID(), ...params]
            .join('-')
            .trim()
            .replace('--', '-');
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
     * @param {String[]} [listeners]
     * @returns {Object}
     */
    generateNestedProps(props, propName, listeners = []) {
        let obj = {};

        // Merge nested object
        if (typeof props[propName] === 'object') {
            assign(obj, props[propName]);
            obj.enabled = true;
        } else {
            obj.enabled = Boolean(props[propName]);
        }

        if (!obj.enabled) {
            return obj;
        }

        // Inherit event listeners
        listeners.forEach(key => {
            if (!obj[key]) {
                obj[key] = [];
            }

            if (Array.isArray(props[key])) {
                obj[key] = obj[key].concat(props[key]);

            } else if (props[key]) {
                obj[key].push(props[key]);
            }
        });

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

    /**
     * Handle a native/synthetic DOM event and notify all listeners defined on the property of the same name.
     *
     * @param {String} type
     * @param {SyntheticEvent} event
     */
    handleEvent(type, event) {
        this.notifyEventListeners(type, [event]);
    }

    /**
     * Inherit all native props that should be passed through to the DOM element,
     * by omitting all props whose key exists in the prop types.
     *
     * @param {Object} props
     * @returns {Object}
     */
    inheritNativeProps(props) {
        return omit(props, ['children', ...Object.keys(this.constructor.propTypes)]);
    }

    /**
     * Execute a function, or an array of functions, with the defined arguments, for the specified property.
     *
     * @param {String} propName
     * @param {*[]} args
     */
    notifyEventListeners(propName, args = []) {
        if (propName.substr(0, 2) !== 'on') {
            propName = 'on' + propName.charAt(0).toUpperCase() + propName.substr(1);
        }

        let listeners = this.props[propName];

        if (!listeners) {
            return;
        } else if (!Array.isArray(listeners)) {
            listeners = [listeners];
        }

        listeners.forEach(func => func(...args));
    }

    /**
     * Transfer all custom props to the first and only child of the current component.
     * This functionality allows for easy composition and wrapping of components.
     *
     * @param {ReactElement|ReactElement[]} children
     * @param {Object} [props]
     * @returns {ReactElement}
     */
    transferToChild(children, props = {}) {
        let child = Children.only(children),
            mergedProps = {};

        Object.keys(props).forEach(key => {
            let newValue = props[key],
                newType = typeof newValue,
                oldValue = child.props[key],
                oldType = typeof oldValue,
                mergedValue = null;

            // If a value exists on both ends, handle accordingly
            // We need to do `typeof` checks so that we don't type juggle incorrectly
            if (oldType !== 'undefined' && newType !== 'undefined') {

                // Event handlers should be wrapped
                if (key.match(/^on[A-Z]/)) {
                    mergedValue = wrapFunctions(newValue, oldValue);

                // Append the new class name
                } else if (key === 'className' || key === 'uniqueClassName') {
                    mergedValue = oldValue + ' ' + newValue;
                }

            } else if (oldType === 'undefined' && newType !== 'undefined') {
                mergedValue = newValue;
            }

            if (mergedValue !== null) {
                mergedProps[key] = mergedValue;
            }
        });

        return React.cloneElement(child, mergedProps);
    }
}
