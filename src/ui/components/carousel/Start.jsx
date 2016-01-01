/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import collectionOf from '../../../ext/prop-types/collectionOf';
import { CONTEXT_TYPES } from './ContextTypes';

export default class Start extends Component {
    /**
     * Handles clicking the start button.
     */
    onClick() {
        this.context.startCycle();
        this.emitEvent('click');
    }

    render() {
        return (
            <button
                type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.onClick.bind(this)}>
                {this.props.children}
            </button>
        );
    }
}

Start.contextTypes = CONTEXT_TYPES;

Start.defaultProps = {
    className: 'carousel-start',
    onClick: null
};

Start.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    onClick: collectionOf.func
};
