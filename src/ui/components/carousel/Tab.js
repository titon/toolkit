/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import autoBind from '../../../ext/decorators/autoBind';
import collectionOf from '../../../ext/prop-types/collectionOf';
import cssClassName from '../../../ext/prop-types/cssClassName';
import tabIndex from '../../../ext/utility/tabIndex';
import CONTEXT_TYPES from './ContextTypes';

export default class Tab extends Component {

    /**
     * Handles clicking the tab buttons.
     *
     * @param {SyntheticEvent} e
     */
    @autoBind
    handleOnClick(e) {
        this.context.showItem(this.props.index);
        this.handleEvent('click', e);
    }

    /**
     * Render a button that cycles to a specific item.
     *
     * @returns {JSX}
     */
    render() {
        let index = this.props.index,
            active = this.context.isItemActive(index);

        return (
            <li>
                <button
                    type="button" role="tab"
                    id={this.formatID('carousel-tab', index)}
                    className={this.formatClass(this.props.className, {
                        'is-active': active
                    })}
                    aria-controls={this.formatID('carousel-item', index)}
                    aria-selected={active}
                    aria-expanded={active}
                    tabIndex={tabIndex(this)}
                    onClick={this.handleOnClick}>
                    <span />
                </button>
            </li>
        );
    }
}

Tab.contextTypes = CONTEXT_TYPES;

Tab.defaultProps = {
    className: 'carousel-tab'
};

Tab.propTypes = {
    className: cssClassName.isRequired,
    index: PropTypes.number.isRequired,
    onClick: collectionOf.func
};
