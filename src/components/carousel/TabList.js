/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Tab from './Tab';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class TabList extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['carousel', 'tabs']
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        onClick: collection.func,
        tabClassName: cssClass
    };

    /**
     * Render a list of tabs that can be clicked on to jump to specific items.
     *
     * @returns {ReactElement}
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
                className={this.formatClass(props.elementClassName, props.className)}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {children}
                </ol>
            </nav>
        );
    }
}
