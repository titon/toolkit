/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Tab from './Tab';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class TabList extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static propTypes = {
        onClick: collectionOf.func
    };

    /**
     * Render a list of tabs that can be clicked on to jump to specific items.
     *
     * @returns {ReactElement}
     */
    render() {
        let children = [],
            props = this.props;

        for (let i = 0; i < this.getContext().itemCount; i++) {
            children.push(
                <Tab
                    index={i}
                    key={'tab-' + i}
                    onClick={props.onClick}
                />
            );
        }

        return (
            <nav
                className={this.formatChildClass('tab-list')}
                {...this.inheritNativeProps(props)}
            >
                <ol>
                    {children}
                </ol>
            </nav>
        );
    }
}
