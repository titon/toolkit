/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Tab from './Tab';
import children from '../../prop-types/children';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Nav extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['tabs', 'nav']
    };

    static propTypes = {
        children: children(Tab),
        className: cssClass,
        elementClassName: cssClass.isRequired
    };

    /**
     * Render the tabs navigation list.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <nav
                id={this.formatID('tabs-nav')}
                className={this.formatClass(props.elementClassName, props.className)}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {props.children}
                </ol>
            </nav>
        );
    }
}
