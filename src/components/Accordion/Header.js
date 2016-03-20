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

export default class Header extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['accordion', 'header']
    };

    static propTypes = {
        active: PropTypes.bool.isRequired,
        children: PropTypes.node,
        elementClassName: cssClass.isRequired,
        index: PropTypes.number.isRequired,
        onClick: collection.func
    };

    /**
     * Update the index on the parent component when clicked.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClick(e) {
        this.context.toggleItem(this.props.index);

        this.handleEvent('click', e);
    }

    /**
     * Render the accordion item header tab and set the relevant active state.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            index = props.index,
            active = props.active;

        return (
            <header
                role="tab"
                id={this.formatID('accordion-header', index)}
                className={this.formatClass(props.elementClassName, {
                    'is-active': active
                })}
                aria-controls={this.formatID('accordion-section', index)}
                aria-selected={active}
                aria-expanded={active}
                tabIndex={tabIndex(this)}
                onClick={this.handleOnClick}>

                {props.children}
            </header>
        );
    }
}
