/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Menu from './Menu';
import Toggle from './Toggle';
import autoBind from '../../decorators/autoBind';
import childrenOfType from '../../prop-types/childrenOfType';
import CONTEXT_TYPES from './ContextTypes';

export default class Drop extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static propTypes = {
        children: childrenOfType(Menu, Toggle)
    };

    state = {
        opened: false
    };

    /**
     * Generate a UID.
     */
    constructor() {
        super();

        this.generateUID();
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            uid: this.uid,
            opened: this.state.opened,
            hideMenu: this.hideMenu,
            showMenu: this.showMenu
        };
    }

    /**
     * Hide the menu by setting the state to closed.
     */
    @autoBind
    hideMenu() {
        this.setState({
            opened: false
        });
    }

    /**
     * Show the menu by setting the state to opened.
     */
    @autoBind
    showMenu() {
        this.setState({
            opened: true
        });
    }

    /**
     * Render the drop container.
     *
     * @returns {JSX}
     */
    render() {
        return (
            <div id={this.formatID('drop')}>
                {this.props.children}
            </div>
        );
    }
}
