/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import CONTEXT_TYPES from './ContextTypes';

export default class Toggle extends Component {
    static contextTypes = CONTEXT_TYPES;

    static propTypes = {
        children: PropTypes.node
    };

    /**
     * Handlers for toggling the display of the mask overlay.
     */
    @bind
    handleOnClick() {
        this.context.toggleOverlay();
    }

    /**
     * Render the child and wrap any `onClick` event handlers.
     *
     * @returns {ReactElement}
     */
    render() {
        return this.transferToChild(this.props.children, {
            onClick: this.handleOnClick,
            className: this.context.expanded ? 'is-active' : ''
        });
    }
}
