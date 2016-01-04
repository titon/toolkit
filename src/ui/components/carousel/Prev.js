/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import autoBind from '../../../ext/decorators/autoBind';
import collectionOf from '../../../ext/prop-types/collectionOf';
import CONTEXT_TYPES from './ContextTypes';

export default class Prev extends Component {

    /**
     * Handles clicking the previous button.
     *
     * @param {SyntheticEvent} e
     */
    @autoBind
    onClick(e) {
        this.context.prevItem();
        this.handleEvent('click', e);
    }

    /**
     * Render a button that cycles to the previous item.
     *
     * @returns {JSX}
     */
    render() {
        return (
            <button
                type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.onClick}>
                {this.props.children}
            </button>
        );
    }
}

Prev.contextTypes = CONTEXT_TYPES;

Prev.defaultProps = {
    className: 'carousel-prev'
};

Prev.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: collectionOf.func
};
