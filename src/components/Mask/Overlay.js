/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../Component';
import bind from '../../decorators/bind';
import { showHidePropTypes } from '../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Overlay extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        collapsible: false
    };

    static propTypes = {
        ...showHidePropTypes,
        children: PropTypes.node,
        collapsible: PropTypes.bool
    };

    state = {
        expanded: false
    };

    /**
     * Determine whether the mask is expanded or not.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            expanded: nextContext.expanded
        });
    }

    /**
     * Only update if the `expanded` state is different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.expanded !== this.state.expanded);
    }

    /**
     * Emit `showing` or `hiding` events before rendering.
     */
    componentWillUpdate() {
        this.emitEvent(this.state.expanded ? 'hiding' : 'showing');
    }

    /**
     * Emit `shown` or `hidden` events after rendering.
     */
    componentDidUpdate() {
        this.emitEvent(this.state.expanded ? 'shown' : 'hidden');
    }

    /**
     * Handler to hide the overlay when clicked if `collapsible` is true.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClick(e) {
        e.preventDefault();

        if (this.props.collapsible) {
            this.context.hideOverlay();
        }
    }

    /**
     * Render the mask overlay.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            expanded = this.state.expanded;

        return (
            <div
                role="presentation"
                id={this.formatID('mask-overlay')}
                className={this.formatChildClass('overlay', {
                    'is-collapsible': props.collapsible,
                    'is-expanded': expanded
                })}
                onClick={this.handleOnClick}
                aria-hidden={!expanded}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </div>
        );
    }

}
