/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collection from '../../prop-types/collection';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Stop extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static propTypes = {
        children: PropTypes.node,
        onClick: collection.func
    };

    /**
     * Handles clicking the stop button.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClick(e) {
        this.context.stopCycle();
        this.handleEvent('click', e);
    }

    /**
     * Render a button that stops the cycle.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <button
                type="button" role="button"
                className={this.formatChildClass('stop')}
                onClick={this.handleOnClick}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </button>
        );
    }
}
