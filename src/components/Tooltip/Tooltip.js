/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import invariant from '../../utility/invariant';
import positionRelativeTo from '../../utility/positionRelativeTo';

export default class Tooltip extends Component {
    static contextTypes = {
        warpOut: PropTypes.func
    };

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

    /**
     * Validate that a tooltip is instantiated within a gateway.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super();

        invariant(typeof context.warpOut !== 'undefined',
            'A `Tooltip` must be instantiated within a `Gateway`.');

        this.state = {
            sourceElement: null
        };
    }

    /**
     * We need to mount the component before we can calculate the dimensions of the element,
     * as well as find the element in the DOM. It kind of sucks we need to do this in did mount,
     * but other solutions aren't as viable.
     */
    componentDidMount() {
        /* eslint react/no-did-mount-set-state: 0 */
        this.setState({
            sourceElement: ReactDOM.findDOMNode(this)
        });
    }

    /**
     * Render the tooltip element.
     *
     * @returns {ReactElement}
     */
    render() {
        let { sourceElement } = this.state,
            { targetElement, ...props } = this.props,
            style = {};

        // Position after the initial mount
        if (sourceElement && targetElement) {
            style = positionRelativeTo(props.position, sourceElement, targetElement, {
                left: props.xOffset,
                top: props.yOffset
            });
        }

        return (
            <div
                role="tooltip"
                id={this.formatID('tooltip')}
                className={this.formatClass(props.elementClassName, props.className, {
                    [props.position]: true
                })}
                style={style}
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
