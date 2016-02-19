/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import Spacer from './Spacer';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import collection from '../../prop-types/collection';
import CONTEXT_TYPES from './ContextTypes';

export default class Pagination extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: 'pagination',
        currentPage: 1,
        showControls: false,
        edges: 5,
        format: 'around',
        grouped: false,
        first: 'First',
        last: 'Last',
        prev: 'Prev',
        next: 'Next',
        label: 'Pagination',
        spacer: '...'
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        itemClassName: cssClass,
        spacerClassName: cssClass,
        totalPages: PropTypes.number.isRequired,
        currentPage: PropTypes.number,
        showControls: PropTypes.bool,
        url: PropTypes.string.isRequired,
        edges: PropTypes.number,
        format: PropTypes.oneOf(['around', 'spaced']),
        grouped: PropTypes.bool,
        first: PropTypes.node,
        last: PropTypes.node,
        prev: PropTypes.node,
        next: PropTypes.node,
        label: PropTypes.string,
        spacer: PropTypes.string,
        onPaging: collection.func,
        onPaged: collection.func
    };

    /**
     * Setup state and generate a UID.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        this.state = {
            page: this.clampPage(props.currentPage, props.totalPages)
        };

        this.generateUID();
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            uid: this.uid,
            url: this.props.url,
            currentPage: this.state.page,
            totalPages: this.props.totalPages,
            goToPage: this.goToPage,
            prevPage: this.prevPage,
            nextPage: this.nextPage
        };
    }

    /**
     * Only update if the `page` has changed.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.page !== this.state.page);
    }

    /**
     * Emit `paging` events before rendering.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     */
    componentWillUpdate(nextProps, nextState) {
        this.emitEvent('paging', [nextState.page, this.state.page]);
    }

    /**
     * Emit `paged` events before rendering.
     *
     * @param {Object} prevProps
     * @param {Object} prevState
     */
    componentDidUpdate(prevProps, prevState) {
        this.emitEvent('paged', [this.state.page, prevState.page]);
    }

    /**
     * Clamp a page between 1 and the total number of pages.
     *
     * @param {Number} page
     * @param {Number} total
     * @returns {Number}
     */
    clampPage(page, total) {
        /* eslint no-nested-ternary: 0 */

        return (page < 1) ? 1 : (page > total) ? total : page;
    }

    /**
     * Create an `Item` with the defined page number.
     *
     * @param {Number} page
     * @returns {ReactElement}
     */
    createItem(page) {
        return (
            <Item key={page} page={page} className={this.props.itemClassName}/>
        );
    }

    /**
     * Create a `Spacer` with the defined spacer content.
     *
     * @param {String} key
     * @returns {ReactElement}
     */
    createSpacer(key) {
        return (
            <Spacer key={key} className={this.props.spacerClassName}>
                {this.props.spacer}
            </Spacer>
        );
    }

    /**
     * Go to a specific page by updating the state.
     *
     * @param {Number} page
     */
    @bind
    goToPage(page) {
        this.setState({
            page: this.clampPage(page, this.props.totalPages)
        });
    }

    /**
     * Go to the next page. If the last page is hit, stop there.
     */
    @bind
    nextPage() {
        this.goToPage(this.state.page + 1);
    }

    /**
     * Go to the previous page. If the first page is hit, stop there.
     */
    @bind
    prevPage() {
        this.goToPage(this.state.page - 1);
    }

    /**
     * Render a list of items based on the defined format.
     *
     * @returns {Spacer[]|Item[]}
     */
    renderItems() {
        let { totalPages, edges, format } = this.props,
            page = this.state.page,
            items = [],
            start = 1,
            stop = totalPages,
            i = 0;

        switch (format) {

            // There should be `edge` items on each side of the current page
            case 'around':
            default:
                if (totalPages < (edges * 2)) {
                    break;
                }

                start = page - edges;
                stop = page + edges;

                // Fix the differences
                while (start < 1) {
                    start++;
                    stop++;
                }

                while (stop > totalPages) {
                    start--;
                    stop--;
                }

                break;

            // There should be `edge` items in the middle, with ellipsis spacers on each side
            case 'spaced':
                let half = Math.floor(edges / 2);

                if (totalPages < (edges + ((half + 1) * 2))) {
                    break;
                }

                // Items on the left side, a single spacer on the right
                if (page < (edges + half)) {
                    for (i = 1; i <= (edges + half); i++) {
                        items.push(this.createItem(i));
                    }

                    items.push(this.createSpacer('right'));

                    for (i = (totalPages - half + 1); i <= totalPages; i++) {
                        items.push(this.createItem(i));
                    }

                // Items on the right side, a single spacer on the left
                } else if (page > (totalPages - half - edges)) {
                    for (i = 1; i <= half; i++) {
                        items.push(this.createItem(i));
                    }

                    items.push(this.createSpacer('left'));

                    for (i = (totalPages - half - edges + 1); i <= totalPages; i++) {
                        items.push(this.createItem(i));
                    }

                // Items in the middle, spacers on each side
                } else {
                    for (i = 1; i <= half; i++) {
                        items.push(this.createItem(i));
                    }

                    items.push(this.createSpacer('left'));

                    for (i = (page - half); i <= (page + half); i++) {
                        items.push(this.createItem(i));
                    }

                    items.push(this.createSpacer('right'));

                    for (i = (totalPages - half + 1); i <= totalPages; i++) {
                        items.push(this.createItem(i));
                    }
                }

                return items;
        }

        for (i = start; i <= stop; i++) {
            items.push(this.createItem(i));
        }

        return items;
    }

    /**
     * Render the pagination list.
     *
     * @returns {ReactElement}
     */
    render() {
        /* eslint react/jsx-max-props-per-line: 0 */

        let { first, last, next, prev, totalPages, itemClassName, showControls, ...props } = this.props,
            page = this.state.page,
            items = [];

        // Prepend first and previous
        if (first && (page > 1 || showControls)) {
            items.push(
                <Item key="first" page={1} className={itemClassName}>
                    {first}
                </Item>
            );
        }

        if (prev && (page > 1 || showControls)) {
            items.push(
                <Item key="prev" page={page - 1} className={itemClassName}>
                    {prev}
                </Item>
            );
        }

        // Generate the list of items
        items = items.concat(this.renderItems());

        // Append next and last
        if (next && (page < totalPages || showControls)) {
            items.push(
                <Item key="next" page={page + 1} className={itemClassName}>
                    {next}
                </Item>
            );
        }

        if (last && (page < totalPages || showControls)) {
            items.push(
                <Item key="last" page={totalPages} className={itemClassName}>
                    {last}
                </Item>
            );
        }

        return (
            <nav
                role="navigation"
                id={this.formatID('pagination')}
                className={this.formatClass(props.elementClassName, props.className, {
                    '@grouped': props.grouped
                })}
                aria-label={props.label}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {items}
                </ol>
            </nav>
        );
    }
}
