/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import invariant from '../../utility/invariant';

export default class Toast extends Component {
    static contextTypes = {
        warpOut: PropTypes.func
    };

    static defaultProps = {
        duration: 5000,
        elementClassName: 'toast'
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        dismissable: PropTypes.bool,
        duration: PropTypes.number,
        elementClassName: cssClass.isRequired,
        gateName: PropTypes.string.isRequired
    };

    /**
     * Generate a UID.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super();

        invariant(typeof context.warpOut !== 'undefined',
            'A `Toast` must be instantiated within a `Gateway`.');

        this.generateUID();
    }

    /**
     * Set a timer to automatically remove the toast after a duration.
     */
    componentDidMount() {
        let { duration } = this.props;

        if (duration > 0) {
            setTimeout(this.hideToast, duration);
        }
    }

    /**
     * Conceal the toast by removing its element from the gateway.
     */
    @bind
    hideToast() {
        this.context.warpOut(this.props.gateName, this.getInternalElement());
    }

    /**
     * Render the toast wrapper.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                role="note"
                className={this.formatClass(props.elementClassName, props.className)}
                onClick={props.dismissable ? this.hideToast : null}>

                {props.children}
            </div>
        );
    }
}
