/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import DocumentState from '../../machines/DocumentState';
import Component from '../../Component';
import Body from './Body';
import Head from './Head';
import Foot from './Foot';
import bind from '../../decorators/bind';
import children from '../../prop-types/children';
import cssClass from '../../prop-types/cssClass';
import collection from '../../prop-types/collection';
import invariant from '../../utility/invariant';
import CONTEXT_TYPES from './ContextTypes';

export default class Modal extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static contextTypes = {
        warpOut: PropTypes.func
    };

    static defaultProps = {
        blackOut: true,
        close: <span className="x" />,
        closeClassName: ['modal', 'close'],
        dismissable: true,
        elementClassName: 'modal',
        fullScreen: false,
        innerClassName: ['modal', 'inner'],
        outerClassName: ['modal', 'outer'],
        stopScroll: true
    };

    static propTypes = {
        blackOut: PropTypes.bool,
        children: children(Body, Head, Foot),
        className: cssClass,
        close: PropTypes.node,
        closeClassName: cssClass.isRequired,
        dismissable: PropTypes.bool,
        elementClassName: cssClass.isRequired,
        fullScreen: PropTypes.bool,
        gateName: PropTypes.string.isRequired,
        innerClassName: cssClass.isRequired,
        onHidden: collection.func,
        onHiding: collection.func,
        onShowing: collection.func,
        onShown: collection.func,
        outerClassName: cssClass.isRequired,
        stopScroll: PropTypes.bool
    };

    /**
     * Validate that a modal is instantiated within a gateway.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super();

        invariant(typeof context.warpOut !== 'undefined',
            'A `Modal` must be instantiated within a `Gateway`.');
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            hideModal: this.hideModal,
            uid: this.getUID()
        };
    }

    /**
     * Since modal's are stateless components and are always expanded,
     * we need to manage all logic while mounting and unmounting.
     *
     * This includes binding events, toggling blackouts,
     * and locking the scroll, based on the defined props.
     */
    componentWillMount() {
        let { dismissable, blackOut, stopScroll } = this.props;

        this.emitEvent('showing');

        if (dismissable) {
            window.addEventListener('keydown', this.handleOnKeyDown);
        }

        if (blackOut) {
            DocumentState.showBlackout();
        }

        if (stopScroll) {
            DocumentState.disableScrolling();
        }

        this.emitEvent('shown');

        // TODO somehow trigger the expanded state after a mount?
        // Would be nice to have a small animation or something.
    }

    /**
     * Reverse the logic that was initialized during mounting.
     */
    componentWillUnmount() {
        let { dismissable, blackOut, stopScroll } = this.props;

        this.emitEvent('hiding');

        if (dismissable) {
            window.removeEventListener('keydown', this.handleOnKeyDown);
        }

        if (blackOut) {
            DocumentState.hideBlackout();
        }

        if (stopScroll) {
            DocumentState.enableScrolling();
        }

        this.emitEvent('hidden');
    }

    /**
     * Conceal the modal by removing its element from the gateway.
     */
    @bind
    hideModal() {
        this.context.warpOut(this.props.gateName, this.getInternalElement());
    }

    /**
     * Handler for clicking the close button.
     */
    @bind
    handleOnClick() {
        this.hideModal();
    }

    /**
     * Handler for closing the modal when a click occurs outside the outer element.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClickOut(e) {
        if (e.target === e.currentTarget) {
            this.hideModal();
        }
    }

    /**
     * Handler for closing the modal when the `esc` key is pressed.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnKeyDown(e) {
        if (e.key === 'Escape') {
            this.hideModal();
        }
    }

    /**
     * Render the modal wrapper.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                role="dialog"
                id={this.formatID('modal')}
                className={this.formatClass(props.elementClassName, props.className, {
                    'is-expanded': true,
                    'is-fullscreen': props.fullScreen
                })}
                aria-labelledby={this.formatID('modal-title')}
                aria-describedby={this.formatID('modal-content')}
                aria-hidden={false}
                aria-expanded={true}
                onClick={props.dismissable ? this.handleOnClickOut : null}
                {...this.inheritNativeProps(props)}>

                <div className={this.formatClass(props.outerClassName)}>
                    <div className={this.formatClass(props.innerClassName)}>
                        {props.children}
                    </div>

                    {props.dismissable && (
                        <button
                            type="button" role="button"
                            className={this.formatClass(props.closeClassName)}
                            onClick={this.handleOnClick}>
                            {props.close}
                        </button>
                    )}
                </div>
            </div>
        );
    }
}
