/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import invariant from '../../utility/invariant';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

let instantiated = false;

export default class Gateway extends Component {
    static module = MODULE;

    static childContextTypes = CONTEXT_TYPES;

    /**
     * Only one instance of the `Gateway` should be used.
     */
    constructor() {
        super();

        invariant(!instantiated, 'Only one `Gateway` may exist.');
        instantiated = true;

        this.gates = {};
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            [MODULE.contextKey]: {
                registerGate: this.registerGate,
                warpIn: this.warpIn,
                warpOut: this.warpOut
            }
        };
    }

    /**
     * Checks to see if a `Gate` has been registered.
     *
     * @param {String} gate
     * @returns {Boolean}
     */
    hasGate(gate) {
        invariant(this.gates[gate], 'The `Gate` "%s" does not exist.', gate);

        return true;
    }

    /**
     * Register a child `Gate` component with a unique name
     * and two handler functions for warping in and out components.
     *
     * @param {String} gate
     * @param {Function} warpIn
     * @param {Function} warpOut
     */
    @bind
    registerGate(gate, warpIn, warpOut) {
        invariant(!this.gates[gate],
            'A `Gate` with the name "%s" has already been created.', gate);

        invariant((typeof warpIn === 'function' && typeof warpOut === 'function'),
            'A `Gate` requires function handlers for warping in and out elements.');

        this.gates[gate] = { warpIn, warpOut };
    }

    /**
     * Render the passed in React element within the defined gate.
     *
     * @param {String} gate
     * @param {ReactElement} element
     */
    @bind
    warpIn(gate, element) {
        if (this.hasGate(gate)) {
            this.gates[gate].warpIn(element);
        }
    }

    /**
     * Remove the passed in React element from the defined gate.
     *
     * @param {String} gate
     * @param {ReactElement} element
     */
    @bind
    warpOut(gate, element) {
        if (this.hasGate(gate)) {
            this.gates[gate].warpOut(element);
        }
    }

    /**
     * Render the gateway and its children.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                className={this.formatClass()}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </div>
        );
    }
}
