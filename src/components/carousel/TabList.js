/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Tab from './Tab';
import collectionOf from '../../prop-types/collectionOf';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class TabList extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['carousel', 'tabs']
    };

    static propTypes = {
        className: cssClassName.isRequired,
        tabClassName: cssClassName,
        onClick: collectionOf.func
    };

    /**
     * Render a list of tabs that can be clicked on to jump to specific items.
     *
     * @returns {JSX}
     */
    render() {
        let children = [],
            props = this.props;

        for (let i = 0; i < this.context.itemCount; i++) {
            children.push(
                <Tab
                    index={i}
                    key={'tab-' + i}
                    className={props.tabClassName}
                    onClick={props.onClick} />
            );
        }

        return (
            <nav
                className={this.formatClass(props.className)}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {children}
                </ol>
            </nav>
        );
    }
}
