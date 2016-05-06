/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import generateTabIndex from '../../utility/generateTabIndex';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Tab extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static propTypes = {
        index: PropTypes.number.isRequired,
        onClick: collectionOf.func
    };

    /**
     * Handles clicking the tab buttons.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClick(e) {
        this.getContext().showItem(this.props.index);
        this.handleEvent('click', e);
    }

    /**
     * Render a button that cycles to a specific item.
     *
     * @returns {ReactElement}
     */
    render() {
        let index = this.props.index,
            active = this.getContext().isItemActive(index);

        return (
            <li>
                <button
                    type="button" role="tab"
                    id={this.formatID('carousel-tab', index)}
                    className={this.formatChildClass('tab', {
                        'is-active': active
                    })}
                    aria-controls={this.formatID('carousel-item', index)}
                    aria-selected={active}
                    aria-expanded={active}
                    tabIndex={generateTabIndex(this)}
                    onClick={this.handleOnClick}
                >
                    <span />
                </button>
            </li>
        );
    }
}
