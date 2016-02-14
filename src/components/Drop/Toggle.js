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
        let opened = this.context.opened;

        return this.transferToChild(this.props.children, {
            onClick: this.handleOnClick,
            className: opened ? 'is-active' : '',
            'aria-controls': this.formatID('drop-menu'),
            'aria-haspopup': true,
            'aria-expanded': opened,
            'aria-selected': opened
        });
    }

}
