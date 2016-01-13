/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../../Component';
import autoBind from '../../../decorators/autoBind';
import collectionOf from '../../../ext/prop-types/collectionOf';
import cssClassName from '../../../ext/prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Stop extends Component {

    /**
     * Handles clicking the stop button.
     *
     * @param {SyntheticEvent} e
     */
    @autoBind
    handleOnClick(e) {
        this.context.stopCycle();
        this.handleEvent('click', e);
    }

    /**
     * Render a button that stops the cycle.
     *
     * @returns {JSX}
     */
    render() {
        return (
            <button
                type="button" role="button"
                className={this.formatClass(this.props.className)}
                onClick={this.handleOnClick}>
                {this.props.children}
            </button>
        );
    }
}

Stop.contextTypes = CONTEXT_TYPES;

Stop.defaultProps = {
    className: ['carousel', 'stop']
};

Stop.propTypes = {
    children: PropTypes.node,
    className: cssClassName.isRequired,
    onClick: collectionOf.func
};
