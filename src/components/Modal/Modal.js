/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import DocumentState from '../../machines/DocumentState';
import Component from '../../Component';
import Factory from './Factory';
import Body from './Body';
import Head from './Head';
import Foot from './Foot';
import bind from '../../decorators/bind';
import children from '../../prop-types/children';
import cssClass from '../../prop-types/cssClass';
import collection from '../../prop-types/collection';
import CONTEXT_TYPES from './ContextTypes';

export default class Modal extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        animation: 'fade',
        blackOut: true,
        close: <span className="x" />,
        closeable: true,
        closeClassName: ['modal', 'close'],
        elementClassName: 'modal',
        fullScreen: false,
        innerClassName: ['modal', 'inner'],
        loading: false,
        outerClassName: ['modal', 'outer'],
        stopScroll: true
    };

    static propTypes = {
        animation: PropTypes.oneOf([
            'fade', 'from-above', 'from-below', 'slide-in-top',
            'slide-in-bottom', 'slide-in-left', 'slide-in-right'
        ]),
        blackOut: PropTypes.bool,
        children: children(Body, Head, Foot),
        className: cssClass,
        close: PropTypes.node,
        closeClassName: cssClass.isRequired,
        closeable: PropTypes.bool,
        elementClassName: cssClass.isRequired,
        factory: PropTypes.instanceOf(Factory).isRequired,
        fullScreen: PropTypes.bool,
        innerClassName: cssClass.isRequired,
        loading: PropTypes.bool,
        onHidden: collection.func,
        onHiding: collection.func,
        onShowing: collection.func,
        onShown: collection.func,
        outerClassName: cssClass.isRequired,
        stopScroll: PropTypes.bool
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
            factory: this.props.factory,
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
        let props = this.props;

        this.emitEvent('showing');

        if (props.closeable) {
            window.addEventListener('keydown', this.handleOnKeyDown);
        }

        if (props.blackOut) {
            DocumentState.showBlackout();
        }

        if (props.stopScroll) {
            DocumentState.disableScrolling();
        }

        this.emitEvent('shown');
    }

    /**
     * Reverse the logic that was initialized during mounting.
     */
    componentWillUnmount() {
        let props = this.props;

        this.emitEvent('hiding');

        if (props.closeable) {
            window.removeEventListener('keydown', this.handleOnKeyDown);
        }

        if (props.blackOut) {
            DocumentState.hideBlackout();
        }

        if (props.stopScroll) {
            DocumentState.enableScrolling();
        }

        this.emitEvent('hidden');
    }

    /**
     * Conceal the modal by removing its instance from the factory.
     */
    @bind
    hideModal() {
        this.props.factory.remove(this);
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

        /* eslint operator-linebreak: 0, react/jsx-handler-names: 0 */

        return (
            <div
                role="dialog"
                id={this.formatID('modal')}
                className={this.formatClass(props.elementClassName, props.className, {
                    'is-expanded': true,
                    'is-fullscreen': props.fullScreen,
                    'is-loading': props.loading,
                    [props.animation]: true
                })}
                aria-labelledby={this.formatID('modal-title')}
                aria-describedby={this.formatID('modal-content')}
                aria-hidden={false}
                aria-expanded={true}
                onClick={props.closeable ? this.handleOnClickOut : null}
                {...this.inheritNativeProps(props)}>

                <div className={this.formatClass(props.outerClassName)}>
                    <div className={this.formatClass(props.innerClassName)}>
                        {props.children}
                    </div>

                    {props.closeable && (
                        <button
                            type="button" role="button"
                            className={this.formatClass(props.closeClassName)}
                            onClick={this.hideModal}>
                            {props.close}
                        </button>
                    )}
                </div>
            </div>
        );
    }
}
