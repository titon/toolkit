/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Toggle extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static propTypes = {
        children: PropTypes.node,
        side: PropTypes.oneOf(['left', 'right']).isRequired
    };

    /**
     * Handle the display of which off canvas sidebar to toggle.
     */
    @bind
    handleOnClick() {
        this.getContext().toggleSidebar(this.props.side);
    }

    /**
     * Render the child and wrap any `onClick` event handler.
     *
     * @returns {ReactElement}
     */
    render() {
        return this.transferToChild(this.props.children, {
            className: this.getContext().isSidebarActive(this.props.side) ? 'is-active' : '',
            onClick: this.handleOnClick
        });
    }
}
