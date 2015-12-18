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
            active = this.props.active;

        return (
            <header role="tab"
                id={this.formatID('accordion-header', index)}
                className={this.formatClass(this.props.className, {
                    'is-active': active
                })}
                aria-controls={this.formatID('accordion-section', index)}
                aria-selected={active}
                aria-expanded={active}
                tabIndex={index}
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
            expanded = this.props.expanded;

        return (
            <SlideCollapse expanded={expanded}>
                <section role="tabpanel"
                    id={this.formatID('accordion-section', index)}
                    className={this.formatClass(this.props.className, {
                        'is-expanded': expanded
                    })}
                    aria-labelledby={this.formatID('accordion-header', index)}
                    aria-hidden={!expanded}
                    aria-expanded={expanded}>

                    {this.props.children}
                </section>
            </SlideCollapse>
        );
    }
}

AccordionSection.contextTypes = CONTEXT_TYPES;

/*----------------------------------------------------------------------------------------------------*/

export class AccordionItem extends Component {
    constructor() {
        super();

        this.state = {
            active: false
        };
    }

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
                    index={this.props.index}
                    active={this.state.active}>

                    {this.props.header}
                </AccordionHeader>

                <AccordionSection
                    className={this.props.sectionClassName}
                    index={this.props.index}
                    expanded={this.state.active}>

                    {this.props.children}
                </AccordionSection>
            </li>
        );
    }

    /**
     * Check to see if this specific accordion item should be active.
     */
    checkIsActive() {
        let active = this.context.isItemActive(this.props.index);

        if (active !== this.state.active) {
            this.setState({
                active: active
            });
        }
    }

    /**
     * Check before mounting.
     */
    componentWillMount() {
        this.checkIsActive();
    }

    /**
     * Check before an update.
     */
    componentWillUpdate() {
        this.checkIsActive();
    }
}

AccordionItem.contextTypes = CONTEXT_TYPES;

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

        // Use concat or we lose the previous state
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
    children: childrenOfType(AccordionItem),
    component: PropTypes.string,
    className: PropTypes.string,
    defaultIndex: collectionOf(PropTypes.number),
    multiple: PropTypes.bool,
    collapsible: PropTypes.bool,
    onShowing: collectionOf(PropTypes.func),
    onShown: collectionOf(PropTypes.func)
};

Accordion.Item = AccordionItem;
