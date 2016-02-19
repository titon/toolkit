/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Mask extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: 'mask'
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired
    };

    state = {
        expanded: false
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
            expanded: this.state.expanded,
            hideOverlay: this.hideOverlay,
            showOverlay: this.showOverlay,
            toggleOverlay: this.toggleOverlay
        };
    }

    /**
     * Only update if the `expanded` state changes.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.expanded !== this.state.expanded);
    }

    /**
     * Conceal the overlay by marking it inactive.
     */
    @bind
    hideOverlay() {
        this.setState({
            expanded: false
        });
    }

    /**
     * Reveal the overlay by marking it active.
     */
    @bind
    showOverlay() {
        this.setState({
            expanded: true
        });
    }

    /**
     * Toggle the active state of the overlay.
     */
    @bind
    toggleOverlay() {
        if (this.state.expanded) {
            this.hideOverlay();
        } else {
            this.showOverlay();
        }
    }

    /**
     * Render the mask container.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                id={this.formatID('mask')}
                className={this.formatClass(props.elementClassName, props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }

}
