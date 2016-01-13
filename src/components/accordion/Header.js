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
import tabIndex from '../../../ext/utility/tabIndex';
import CONTEXT_TYPES from './ContextTypes';

export default class Header extends Component {

    /**
     * Update the index on the parent component when clicked.
     *
     * @param {SyntheticEvent} e
     */
    @autoBind
    handleOnClick(e) {
        let index = this.props.index,
            context = this.context;

        if (context.isItemCollapsible(index)) {
            context.hideItem(index);
        } else {
            context.showItem(index);
        }

        this.handleEvent('click', e);
    }

    /**
     * Render the accordion item header tab and set the relevant active state.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props,
            index = props.index,
            active = props.active;

        return (
            <header
                role="tab"
                id={this.formatID('accordion-header', index)}
                className={this.formatClass(props.className, {
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

Header.contextTypes = CONTEXT_TYPES;

Header.defaultProps = {
    className: ['accordion', 'header']
};

Header.propTypes = {
    children: PropTypes.node,
    className: cssClassName.isRequired,
    active: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    onClick: collectionOf.func
};
