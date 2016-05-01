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
     * Handle the display of the menu through toggling.
     */
    @bind
    handleOnClick() {
        this.context.toggleMenu();
    }

    /**
     * Render the child and wrap any `onClick` event handler.
     *
     * @returns {ReactElement}
     */
    render() {
        let { expanded } = this.context;

        return this.transferToChild(this.props.children, {
            'aria-controls': this.formatID('drop-menu'),
            'aria-expanded': expanded,
            'aria-haspopup': true,
            'aria-selected': expanded,
            className: expanded ? 'is-active' : '',
            onClick: this.handleOnClick
        });
    }

}
