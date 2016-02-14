/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClassName from '../../prop-types/cssClassName';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './ContextTypes';

export default class Overlay extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['mask', 'overlay'],
        collapsible: false
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        collapsible: PropTypes.bool,
        onHiding: collectionOf.func,
        onHidden: collectionOf.func,
        onShowing: collectionOf.func,
        onShown: collectionOf.func
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
                id={this.formatID('mask-overlay')}
                className={this.formatClass(props.className, {
                    'is-expanded': expanded,
                    'is-collapsible': props.collapsible
                })}
                onClick={this.handleOnClick}
                aria-hidden={!expanded}
                aria-expanded={expanded}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }

}
