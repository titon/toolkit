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
    currentIndex: PropTypes.number,
    showItemCallback: PropTypes.func
};

/*----------------------------------------------------------------------------------------------------*/

class AccordionHeader extends Component {
    /**
     * Render the accordion item header tab and set the relevant active state.
     *
     * @returns {JSX}
     */
    render() {
        let isActive = (this.props.index === this.context.currentIndex);

        return (
            <header role="tab"
                id={this.formatID('accordion-header', this.props.index)}
                className={this.formatClass(this.props.className, {
                    'is-active': isActive
                })}
                aria-controls={this.formatID('accordion-section', this.props.index)}
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
        this.context.showItemCallback(this.props.index);
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
        let isActive = (this.props.index === this.context.currentIndex);

        return (
            <SlideCollapse visible={isActive}>
                <section role="tabpanel"
                    id={this.formatID('accordion-section', this.props.index)}
                    className={this.formatClass(this.props.className)}
                    aria-labelledby={this.formatID('accordion-header', this.props.index)}
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
    index: PropTypes.number,
    header: PropTypes.node,
    headerClassName: PropTypes.string,
    sectionClassName: PropTypes.string
};

/*----------------------------------------------------------------------------------------------------*/

export default class Accordion extends Component {
    constructor() {
        super();

        this.state = {
            index: 0
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
                aria-multiselectable={this.props.multiple}
                aria-activedescendant={this.formatID('accordion-header', this.state.index)}>

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
        this.emitEvent('showing', [nextState.index, this.state.index]);
    }

    /**
     * Emit `shown` event after rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        this.emitEvent('shown', [this.state.index, prevState.index]);
    }

    /**
     * Only update if item indices are different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.index !== this.state.index);
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            uid: this.uid,
            currentIndex: this.state.index,
            showItemCallback: this.showItem.bind(this)
        };
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

        this.setState({
            index: index
        });
    }

    /**
     * TODO
     *
     * @param index
     * @returns {boolean}
     */
    isItemActive(index) {
        if (this.props.multiple || this.props.collapsible && index === this.state.index) {
            return true;
        }
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
