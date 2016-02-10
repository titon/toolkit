/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Menu from './Menu';
import Toggle from './Toggle';
import bind from '../../decorators/bind';
import childrenOfType from '../../prop-types/childrenOfType';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './ContextTypes';

export default class Drop extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static propTypes = {
        children: childrenOfType(Menu, Toggle),
        onHiding: collectionOf.func,
        onHidden: collectionOf.func,
        onShowing: collectionOf.func,
        onShown: collectionOf.func
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
     * Bind handlers before mounting.
     */
    componentWillMount() {
        window.addEventListener('click', this.handleOnClickOut);
    }

    /**
     * Unbind handlers when unmounting.
     */
    componentWillUnmount() {
        window.removeEventListener('click', this.handleOnClickOut);
    }

    /**
     * Only update if the open state is different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.opened !== this.state.opened);
    }

    /**
     * Emit `showing` or `hiding` events before rendering.
     */
    componentWillUpdate() {
        this.emitEvent(this.state.opened ? 'hiding' : 'showing');
    }

    /**
     * Emit `shown` or `hidden` events after rendering.
     */
    componentDidUpdate() {
        this.emitEvent(this.state.opened ? 'shown' : 'hidden');
    }

    /**
     * When a click occurs outside the drop container, and the menu is open,
     * automatically hide the menu.
     *
     * @param {Event} e
     */
    @bind
    handleOnClickOut(e) {
        if (this.state.opened && !this.refs.container.contains(e.target)) {
            this.hideMenu();
        }
    }

    /**
     * Hide the menu by setting the state to closed.
     */
    @bind
    hideMenu() {
        this.setState({
            opened: false
        });
    }

    /**
     * Show the menu by setting the state to opened.
     */
    @bind
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
            <div id={this.formatID('drop')} ref="container">
                {this.props.children}
            </div>
        );
    }
}
