/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import tabIndex from '../../utility/tabIndex';
import CONTEXT_TYPES from './ContextTypes';

export default class Tab extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['carousel', 'tab']
    };

    static propTypes = {
        elementClassName: cssClass.isRequired,
        index: PropTypes.number.isRequired,
        onClick: collection.func
    };

    /**
     * Handles clicking the tab buttons.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClick(e) {
        this.context.showItem(this.props.index);
        this.handleEvent('click', e);
    }

    /**
     * Render a button that cycles to a specific item.
     *
     * @returns {ReactElement}
     */
    render() {
        let index = this.props.index,
            active = this.context.isItemActive(index);

        return (
            <li>
                <button
                    type="button" role="tab"
                    id={this.formatID('carousel-tab', index)}
                    className={this.formatClass(this.props.elementClassName, {
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
