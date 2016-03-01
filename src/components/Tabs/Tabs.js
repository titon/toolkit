/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import children from '../../prop-types/children';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Tabs extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: 'tabs',
        defaultIndex: 0,
        collapsible: false,
        persistState: false,
        loadFragment: true,
        cookieDuration: 30
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        defaultIndex: collection.number,
        collapsible: PropTypes.bool,
        persistState: PropTypes.bool,
        loadFragment: PropTypes.bool,
        cookieDuration: PropTypes.number
    };

    state = {
        index: -1
    };

    /**
     * Generate a UID.
     */
    constructor() {
        super();

        this.generateUID();
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            uid: this.getUID(),
            activeIndex: this.state.index,
            hideSection: this.hideSection,
            showSection: this.showSection,
            toggleSection: this.toggleSection,
            isSectionCollapsible: this.isSectionCollapsible,
            isSectionActive: this.isSectionActive
        };
    }

    /**
     * Set the default index before mounting.
     */
    componentWillMount() {
        this.showSection(this.props.defaultIndex);
    }

    /**
     * Only update if the index is different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.index !== this.state.index);
    }

    /**
     * Conceal a section by removing its index from the active state.
     *
     * @param {Number} index
     */
    @bind
    hideSection(index) {

    }

    /**
     * Returns true if the section at the specified index can be collapsed.
     *
     * @param {Number} index
     * @returns {Boolean}
     */
    @bind
    isSectionCollapsible(index) {
        return (this.props.collapsible && this.isSectionActive(index));
    }

    /**
     * Returns true if the section at the specified index is active.
     *
     * @param {Number} index
     * @returns {Boolean}
     */
    @bind
    isSectionActive(index) {
        return (this.state.index === index);
    }

    /**
     * Reveal the section at the defined index, and collapse all other sections.
     *
     * @param {Number} index
     */
    @bind
    showSection(index) {

    }

    /**
     * Toggle the display state of a specific index.
     *
     * @param {Number} index
     */
    @bind
    toggleSection(index) {
        if (this.isSectionCollapsible(index)) {
            this.hideSection(index);
        } else {
            this.showSection(index);
        }
    }

    /**
     * Render the wrapping tabs element.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div role="tablist"
                id={this.formatID('tabs')}
                className={this.formatClass(props.elementClassName, props.className, {
                    'is-collapsible': props.collapsible
                })}
                aria-live="off"
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
