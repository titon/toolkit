/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Tab from './Tab';
import collectionOf from '../../../ext/prop-types/collectionOf';
import cssClassName from '../../../ext/prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class TabList extends Component {

    /**
     * Render a list of tabs that can be clicked on to jump to specific items.
     *
     * @returns {JSX}
     */
    render() {
        let children = [];

        for (let i = 0; i < this.context.itemCount; i++) {
            children.push(
                <Tab
                    index={i}
                    key={'tab-' + i}
                    className={this.props.tabClassName}
                    onClick={this.props.onClick} />
            );
        }

        return (
            <nav className={this.formatClass(this.props.className)} data-carousel-tabs={true}>
                <ol>
                    {children}
                </ol>
            </nav>
        );
    }
}

TabList.contextTypes = CONTEXT_TYPES;

TabList.defaultProps = {
    className: 'carousel-tabs'
};

TabList.propTypes = {
    className: cssClassName.isRequired,
    tabClassName: cssClassName,
    onClick: collectionOf.func
};
