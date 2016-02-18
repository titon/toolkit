/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Item extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['pagination', 'item']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        page: PropTypes.number.isRequired
    };

    /**
     * Handler the jumps to another page.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClick(e) {
        e.preventDefault();

        this.context.goToPage(this.props.page);
    }

    /**
     * Render the pagination item link.
     *
     * @returns {ReactElement}
     */
    render() {
        let { page, ...props } = this.props,
            context = this.context,
            key = this._reactInternalInstance._currentElement.key; // TODO Change?

        return (
            <li
                className={this.formatClass(props.className, {
                    'is-active': (context.currentPage === page),
                    'is-first': (key === 'first'),
                    'is-last': (key === 'last'),
                    'is-prev': (key === 'prev'),
                    'is-next': (key === 'next')
                })}>

                <a href={context.url.replace('{{page}}', page)} onClick={this.handleOnClick}>
                    {props.children || page}
                </a>
            </li>
        );
    }
}
