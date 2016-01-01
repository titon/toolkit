/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import childrenOfType from '../../../ext/prop-types/childrenOfType';
import collectionOf from '../../../ext/prop-types/collectionOf';
import { CONTEXT_TYPES } from './ContextTypes';

export default class Accordion extends Component {
    constructor() {
        super();

        this.state = {
            indices: []
        };

        this.generateUID();
        this.autoBind('hideItem', 'showItem', 'isItemActive', 'isItemCollapsible');
    }

    /**
     * Render the wrapping accordion element.
     *
     * @returns {JSX}
     */
    render() {
        return (
            <ul role="tablist"
                id={this.formatID('accordion')}
                className={this.formatClass(this.props.className, this.props.component, {
                    'is-multiple': this.props.multiple,
                    'is-collapsible': this.props.collapsible
                })}
                aria-live="off"
                aria-multiselectable={this.props.multiple}>

                {this.props.children}
            </ul>
        );
    }

    /**
     * Set the default index before mounting.
     */
    componentWillMount() {
        this.showItem(this.props.defaultIndex);
    }

    /**
     * Emit `showing` event before rendering.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     */
    componentWillUpdate(nextProps, nextState) {
        this.emitEvent('showing', [nextState.indices, this.state.indices]);
    }

    /**
     * Emit `shown` event after rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        this.emitEvent('shown', [this.state.indices, prevState.indices]);
    }

    /**
     * Only update if item indices are different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.multiple || nextState.indices[0] !== this.state.indices[0]);
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            uid: this.uid,
            activeIndices: this.state.indices,
            hideItem: this.hideItem,
            showItem: this.showItem,
            isItemCollapsible: this.isItemCollapsible,
            isItemActive: this.isItemActive
        };
    }

    /**
     * Conceal an item by removing its index from the active state.
     *
     * @param {Number} index
     */
    hideItem(index) {
        this.setState({
            indices: this.state.indices.filter(value => value !== index)
        });
    }

    /**
     * Reveal the item at the defined index, and collapse all other items.
     *
     * @param {Number|Number[]} index
     */
    showItem(index) {
        let multiple = this.props.multiple,
            indices = multiple ? this.state.indices : [],
            total = Children.count(this.props.children);

        if (Array.isArray(index)) {
            if (!multiple) {
                index = [index[0]];
            }
        } else {
            index = [index];
        }

        // Use concat or we lose the previous state because of references
        // Also filter out any invalid indices
        this.setState({
            indices: indices.concat(index).filter(i => (i >= 0 && i < total))
        });
    }

    /**
     * Returns true if the item at the specified index can be collapsed.
     *
     * @param {Number} index
     * @returns {Boolean}
     */
    isItemCollapsible(index) {
        return ((this.props.multiple || this.props.collapsible) && this.isItemActive(index));
    }

    /**
     * Returns true if the item at the specified index is active based on the current indices.
     *
     * @param {Number} index
     * @returns {Boolean}
     */
    isItemActive(index) {
        return (this.state.indices.indexOf(index) >= 0);
    }
}

Accordion.childContextTypes = CONTEXT_TYPES;

Accordion.defaultProps = {
    className: 'accordion',
    defaultIndex: 0,
    multiple: false,
    collapsible: false,
    onShowing: null,
    onShown: null
};

Accordion.propTypes = {
    children: childrenOfType(Item),
    component: PropTypes.string,
    className: PropTypes.string,
    defaultIndex: collectionOf.number,
    multiple: PropTypes.bool,
    collapsible: PropTypes.bool,
    onShowing: collectionOf.func,
    onShown: collectionOf.func
};
