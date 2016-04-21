/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Toast from './Toast';
import Gate from '../Gateway/Gate';

export default class ToastGate extends Gate {
    static defaultProps = {
        ...Gate.defaultProps,
        contract: Toast,
        gateClassName: ['toast', 'gate'],
        position: 'bottom-left'
    };

    static propTypes = {
        ...Gate.propTypes,
        animation: PropTypes.oneOf([
            'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right'
        ]),
        position: PropTypes.oneOf([
            'top-left', 'top-center', 'top-right', 'center-left',
            'center-right', 'bottom-left', 'bottom-center', 'bottom-right'
        ])
    };

    /**
     * Render the gateway and its children.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <aside
                role="log"
                className={this.formatClass(
                    props.elementClassName,
                    props.className,
                    props.gateClassName,
                    props.animation,
                    props.position
                )}
                aria-relevant="additions"
                aria-hidden="false"
                {...this.inheritNativeProps(props)}>

                {this.renderChildren(this.state.children)}
            </aside>
        );
    }
}