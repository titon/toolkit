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
        outerClassName: cssClass.isRequired,
        stopScroll: PropTypes.bool
    };

    state = {
        expanded: false
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
     * Before mounting, lock scrolling and display a blackout, it applicable.
     */
    componentWillMount() {
        let { dismissable, blackOut, stopScroll } = this.props;

        if (dismissable) {
            window.addEventListener('keyup', this.handleOnKeyUp);
        }

        if (blackOut) {
            DocumentState.showBlackout();
        }

        if (stopScroll) {
            DocumentState.disableScrolling();
        }
    }

    /**
     * Set the expanded state once mounted to trigger any transitions.
     * We must do this after a mount, as modal's are passed through to gateways.
     */
    componentDidMount() {
        /* eslint react/no-did-mount-set-state: 0 */
        this.setState({
            expanded: true
        });
    }

    /**
     * Reverse the logic that was initialized during mounting.
     */
    componentWillUnmount() {
        let { dismissable, blackOut, stopScroll } = this.props;

        if (dismissable) {
            window.removeEventListener('keyup', this.handleOnKeyUp);
        }

        if (blackOut) {
            DocumentState.hideBlackout();
        }

        if (stopScroll) {
            DocumentState.enableScrolling();
        }
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
    handleOnClickOut({ target, currentTarget }) {
        if (target === currentTarget) {
            this.hideModal();
        }
    }

    /**
     * Handler for closing the modal when the `esc` key is pressed.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnKeyUp({ key }) {
        if (key === 'Escape') {
            this.hideModal();
        }
    }

    /**
     * Render the modal wrapper.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            { expanded } = this.state;

        return (
            <div
                role="dialog"
                id={this.formatID('modal')}
                className={this.formatClass(props.elementClassName, props.className, {
                    'is-dismissable': props.dismissable,
                    'is-expanded': expanded,
                    'is-fullscreen': props.fullScreen
                })}
                aria-labelledby={this.formatID('modal-title')}
                aria-describedby={this.formatID('modal-content')}
                aria-hidden={!expanded}
                aria-expanded={expanded}
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
