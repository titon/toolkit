/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import debounce from '../../decorators/debounce';
import positionRelativeTo from '../../utility/positionRelativeTo';

export default class Tooltip extends Component {
    static defaultProps = {
        arrowClassName: ['tooltip', 'arrow'],
        bodyClassName: ['tooltip', 'body'],
        elementClassName: 'tooltip',
        headClassName: ['tooltip', 'head'],
        innerClassName: ['tooltip', 'inner'],
        position: 'top-center',
        xOffset: 0,
        yOffset: 0
    };

    static propTypes = {
        arrowClassName: cssClass.isRequired,
        bodyClassName: cssClass.isRequired,
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        headClassName: cssClass.isRequired,
        innerClassName: cssClass.isRequired,
        position: PropTypes.oneOf(['top-center', 'bottom-center', 'center-left', 'center-right']),
        // Is an HTML element, but element/node prop types don't work
        targetElement: PropTypes.object,
        title: PropTypes.node,
        xOffset: PropTypes.number,
        yOffset: PropTypes.number
    };

    state = {
        sourceElement: null
    };

    /**
     * Bind a handler to re-position the tooltip on resize.
     */
    componentWillMount() {
        window.addEventListener('resize', this.handleOnResize);
    }

    /**
     * We need to mount the component before we can calculate the dimensions of the element,
     * as well as find the element in the DOM. It kind of sucks we need to do this in did mount,
     * but other solutions aren't as viable.
     */
    componentDidMount() {
        /* eslint react/no-did-mount-set-state: 0 */
        if (this.props.targetElement) {
            this.setState({
                sourceElement: ReactDOM.findDOMNode(this)
            });
        }
    }

    /**
     * Unbind the resize handler.
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleOnResize);
    }

    /**
     * Calculate the `top` and `left` values to position the tooltip to.
     * This requires a source element and target element (provided by `Warp`).
     *
     * @returns {Object}
     */
    calculatePosition() {
        let { sourceElement } = this.state,
            { targetElement, position, xOffset, yOffset } = this.props;

        if (sourceElement && targetElement) {
            return positionRelativeTo(position, sourceElement, targetElement, {
                left: xOffset,
                top: yOffset
            });
        }

        return {};
    }

    /**
     * Handler that will force an update and a render, once a resize event has finished.
     */
    @bind
    @debounce(150)
    handleOnResize() {
        this.forceUpdate();
    }

    /**
     * Render the tooltip element.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                role="tooltip"
                id={this.formatID('tooltip')}
                className={this.formatClass(props.elementClassName, props.className, {
                    [props.position]: true
                })}
                style={this.calculatePosition()}
                aria-labelledby={props.title ? this.formatID('tooltip-title') : null}
                aria-describedby={this.formatID('tooltip-content')}
                {...this.inheritNativeProps(props)}>

                <div className={this.formatClass(props.innerClassName)}>
                    {props.title && (
                        <div
                            id={this.formatID('tooltip-title')}
                            className={this.formatClass(props.headClassName)}>
                            {props.title}
                        </div>
                    )}

                    <div
                        id={this.formatID('tooltip-content')}
                        className={this.formatClass(props.bodyClassName)}>
                        {props.children}
                    </div>

                    <div className={this.formatClass(props.arrowClassName)} />
                </div>
            </div>
        );
    }
}
