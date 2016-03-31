/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Modal from './Modal';
import { default as BaseGate } from '../Gateway/Gate';

export default class Gate extends BaseGate {
    static defaultProps = {
        ...BaseGate.defaultProps,
        animation: 'fade',
        contract: Modal,
        gateClassName: ['modal', 'gate']
    };

    static propTypes = {
        ...BaseGate.propTypes,
        animation: PropTypes.oneOf([
            'fade', 'from-above', 'from-below', 'slide-in-top',
            'slide-in-bottom', 'slide-in-left', 'slide-in-right'
        ])
    };

    /**
     * {@inheritdoc}
     *
     * @param {ReactElement[]} children
     * @returns {ReactElement[]}
     */
    renderChildren(children) {
        // TODO implement react-motion
        return (
            <div className={this.formatClass(this.props.animation)}>
                {children}
            </div>
        );
    }
}
