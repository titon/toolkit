/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import invariant from './invariant';

/**
 * Create an anonymous factory class based on the provided contract.
 * The contract must be the name of the component it manages.
 *
 * @param {String} contract
 * @returns {Factory}
 */
export default function createFactory(contract) {
    return class {
        contract = contract;
        elements = [];
        index = 0;
        listeners = [];

        /**
         * Validate an element and add it to the list of elements to be rendered.
         *
         * @param {ReactElement} element
         */
        addElement(element) {
            this.validateElement(element);

            this.elements.push(React.cloneElement(element, {
                key: this.index++
            }));

            this.notify();
        }

        /**
         * Notify all listeners about element changes.
         */
        notify() {
            this.listeners.forEach(func => func(this.elements));
        }

        /**
         * Remove an element from the list based on its component.
         *
         * @param {ReactComponent} component
         */
        remove(component) {
            this.removeElement(component._reactInternalInstance._currentElement);
        }

        /**
         * Remove an element from the list.
         *
         * @param {ReactElement} element
         */
        removeElement(element) {
            this.validateElement(element);

            this.elements = this.elements.filter(value => value !== element);

            this.notify();
        }

        /**
         * Subscribe to this factory for any changes.
         *
         * @param {Function} func
         */
        subscribe(func) {
            this.listeners.push(func);
        }

        /**
         * Validate that an element is in fact a React element and that it
         * matches the contract.
         *
         * @param {ReactElement} element
         */
        validateElement(element) {
            let name = this.contract;

            invariant(React.isValidElement(element) && element.type.name === name,
                'Value passed to `%sFactory` must be an instance of `%s` and inherit from `ReactElement`.',
                name, name);
        }
    };
}
