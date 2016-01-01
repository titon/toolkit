/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import collectionOf from '../../../ext/prop-types/collectionOf';
import { CONTEXT_TYPES } from './ContextTypes';

export default class Stop extends Component {
    render() {
        return (
            <button type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.onClick.bind(this)}>
                {this.props.children}
            </button>
        );
    }

    /**
     * Handles clicking the stop button.
     */
    onClick() {
        this.context.stopCycle();
        this.emitEvent('click');
    }
}

Stop.contextTypes = CONTEXT_TYPES;

Stop.defaultProps = {
    className: 'carousel-stop',
    onClick: null
};

Stop.propTypes = {
    className: PropTypes.string,
    onClick: collectionOf.func
};
