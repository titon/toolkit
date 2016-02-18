/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import bind from '../../decorators/bind';
import cssClassName from '../../prop-types/cssClassName';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './ContextTypes';

export default class Pagination extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: 'pagination',
        currentPage: 1,
        toShow: 10,
        showControls: false,
        grouped: false,
        first: 'First',
        last: 'Last',
        prev: 'Prev',
        next: 'Next',
        label: 'Pagination'
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        itemClassName: cssClassName,
        uniqueClassName: cssClassName,
        totalPages: PropTypes.number.isRequired,
        currentPage: PropTypes.number,
        url: PropTypes.string.isRequired,
        toShow: PropTypes.number,
        showControls: PropTypes.bool,
        grouped: PropTypes.bool,
        first: PropTypes.node,
        last: PropTypes.node,
        prev: PropTypes.node,
        next: PropTypes.node,
        label: PropTypes.string,
        onPaging: collectionOf.func,
        onPaged: collectionOf.func
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
     * Render the pagination list.
     *
     * @returns {ReactElement}
     */
    render() {
        /* eslint react/jsx-max-props-per-line: 0 */

        let { first, last, next, prev, itemClassName, showControls, ...props } = this.props,
            page = this.state.page,
            toShow = Math.round(props.toShow / 2),
            lastPage = props.totalPages,
            startPage = page - toShow,
            stopPage = page + toShow,
            diff = 0,
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
        if (startPage < 1) {
            diff = Math.abs(startPage) + 1;

        } else if (stopPage > lastPage) {
            diff = -(stopPage - lastPage);
        }

        startPage += diff;
        stopPage += diff;

        for (let i = startPage; i <= stopPage; i++) {
            items.push(
                <Item key={i} page={i} className={itemClassName} />
            );
        }

        // Append next and last
        if (next && (page < lastPage || showControls)) {
            items.push(
                <Item key="next" page={page + 1} className={itemClassName}>
                    {next}
                </Item>
            );
        }

        if (last && (page < lastPage || showControls)) {
            items.push(
                <Item key="last" page={lastPage} className={itemClassName}>
                    {last}
                </Item>
            );
        }

        return (
            <nav
                role="navigation"
                className={this.formatClass(props.className, {
                    '@grouped': props.grouped
                })}
                aria-label={props.label}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {items}
                </ol>

                {props.children}
            </nav>
        );
    }
}
