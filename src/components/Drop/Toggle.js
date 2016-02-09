/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
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
        let context = this.context;

        if (context.opened) {
            context.hideMenu();
        } else {
            context.showMenu();
        }
    }

    /**
     * Render the child and wrap any `onClick` event handler.
     *
     * @returns {JSX}
     */
    render() {
        let element = Children.only(this.props.children);

        return React.cloneElement(element, {
            onClick: this.wrapHandlers(element.props.onClick, this.handleOnClick),
            'aria-controls': this.formatID('drop-menu'),
            'aria-haspopup': true
        });
    }

}
