/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Prev extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['carousel', 'prev']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        onClick: collectionOf.func
    };

    /**
     * Handles clicking the previous button.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClick(e) {
        this.context.prevItem();
        this.handleEvent('click', e);
    }

    /**
     * Render a button that cycles to the previous item.
     *
     * @returns {ReactElement}
     */
    render() {
        return (
            <button
                type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.handleOnClick}
                {...this.inheritNativeProps(this.props)}>

                {this.props.children}
            </button>
        );
    }
}
