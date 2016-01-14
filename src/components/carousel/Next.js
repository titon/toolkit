/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import autoBind from '../../decorators/autoBind';
import collectionOf from '../../prop-types/collectionOf';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Next extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['carousel', 'next']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        onClick: collectionOf.func
    };

    /**
     * Handles clicking the next button.
     *
     * @param {SyntheticEvent} e
     */
    @autoBind
    handleOnClick(e) {
        this.context.nextItem();
        this.handleEvent('click', e);
    }

    /**
     * Render a button that cycles to the next item.
     *
     * @returns {JSX}
     */
    render() {
        return (
            <button
                type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.handleOnClick}>
                {this.props.children}
            </button>
        );
    }
}
