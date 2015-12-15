/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from './Component';
import SlideCollapse from '../transitions/SlideCollapse';
import childrenOfType from '../../ext/prop-types/childrenOfType';
import collectionOf from '../../ext/prop-types/collectionOf';

const CONTEXT_TYPES = {
    uid: PropTypes.string,
    hideItem: PropTypes.func,
    showItem: PropTypes.func,
    isItemCollapsible: PropTypes.func,
    isItemActive: PropTypes.func
};

/*----------------------------------------------------------------------------------------------------*/

class AccordionHeader extends Component {
    /**
     * Render the accordion item header tab and set the relevant active state.
     *
     * @returns {JSX}
     */
    render() {
        let index = this.props.index,
            isActive = this.context.isItemActive(index);

        return (
            <header role="tab"
                id={this.formatID('accordion-header', index)}
                className={this.formatClass(this.props.className, {
                    'is-active': isActive
                })}
                aria-controls={this.formatID('accordion-section', index)}
                aria-selected={isActive}
                aria-expanded={isActive}
                onClick={this.onClick.bind(this)}>

                {this.props.children}
            </header>
        );
    }

    /**
     * Update the index on the parent component when clicked.
     */
    onClick() {
        let index = this.props.index,
            context = this.context;

        if (context.isItemCollapsible(index)) {
            context.hideItem(index);
        } else {
            context.showItem(index);
        }
    }
}

AccordionHeader.contextTypes = CONTEXT_TYPES;

/*----------------------------------------------------------------------------------------------------*/

class AccordionSection extends Component {
    /**
     * Render the accordion item section content and wrap with a collapsible slide transition.
     *
     * @returns {JSX}
     */
    render() {
        let index = this.props.index,
            isActive = this.context.isItemActive(index);

        return (
            <SlideCollapse visible={isActive}>
                <section role="tabpanel"
                    id={this.formatID('accordion-section', index)}
                    className={this.formatClass(this.props.className)}
                    aria-labelledby={this.formatID('accordion-header', index)}
                    aria-hidden={!isActive}
                    aria-expanded={isActive}>

                    {this.props.children}
                </section>
            </SlideCollapse>
        );
    }
}

AccordionSection.contextTypes = CONTEXT_TYPES;

/*----------------------------------------------------------------------------------------------------*/

export class AccordionItem extends Component {
    /**
     * Render the accordion item and pass all relevant props to the sub-children.
     *
     * @returns {JSX}
     */
    render() {
        return (
            <li>
                <AccordionHeader
                    className={this.props.headerClassName}
                    index={this.props.index}>

                    {this.props.header}
                </AccordionHeader>

                <AccordionSection
                    className={this.props.sectionClassName}
                    index={this.props.index}>

                    {this.props.children}
                </AccordionSection>
            </li>
        );
    }
}

AccordionItem.defaultProps = {
    index: -1,
    header: '',
    headerClassName: 'accordion-header',
    sectionClassName: 'accordion-section'
};

AccordionItem.propTypes = {
    index: PropTypes.number.isRequired,
    header: PropTypes.node.isRequired,
    headerClassName: PropTypes.string,
    sectionClassName: PropTypes.string
};

/*----------------------------------------------------------------------------------------------------*/

export default class Accordion extends Component {
    constructor() {
        super();

        this.state = {
            indices: []
        };
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
                className={this.formatClass(this.props.className)}
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
            hideItem: this.hideItem.bind(this),
            showItem: this.showItem.bind(this),
            isItemCollapsible: this.isItemCollapsible.bind(this),
            isItemActive: this.isItemActive.bind(this)
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
     * @param {Number} index
     */
    showItem(index) {
        let total = Children.count(this.props.children);

        if (index < 0) {
            index = 0;
        } else if (index >= total) {
            index = total - 1;
        }

        // Use concat or we lose the previous state
        if (this.props.multiple) {
            index = this.state.indices.concat([index]);
        } else {
            index = [index];
        }

        this.setState({
            indices: index
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
    children: childrenOfType(AccordionItem),
    className: PropTypes.string,
    defaultIndex: PropTypes.number,
    multiple: PropTypes.bool,
    collapsible: PropTypes.bool,
    onShowing: collectionOf(PropTypes.func),
    onShown: collectionOf(PropTypes.func)
};

Accordion.Item = AccordionItem;
