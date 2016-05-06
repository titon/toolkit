/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Toggle extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    /**
     * Handlers for toggling the display of the mask overlay.
     */
    @bind
    handleOnClick() {
        this.getContext().toggleOverlay();
    }

    /**
     * Render the child and wrap any `onClick` event handlers.
     *
     * @returns {ReactElement}
     */
    render() {
        return this.transferToChild(this.props.children, {
            className: this.getContext().expanded ? 'is-active' : '',
            onClick: this.handleOnClick
        });
    }
}
