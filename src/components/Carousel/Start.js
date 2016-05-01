/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../Component';
import bind from '../../decorators/bind';
import collection from '../../prop-types/collection';
import CONTEXT_TYPES from './ContextTypes2';
import MODULE from './module';

export default class Start extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static propTypes = {
        children: PropTypes.node,
        onClick: collection.func
    };

    /**
     * Handles clicking the start button.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClick(e) {
        this.context.startCycle();
        this.handleEvent('click', e);
    }

    /**
     * Render a button that starts the automatic cycle.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <button
                type="button" role="button"
                className={this.formatChildClass('start')}
                onClick={this.handleOnClick}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </button>
        );
    }
}
