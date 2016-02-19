/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Divider from './Divider';
import Header from './Header';
import Item from './Item';
import children from '../../prop-types/children';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Menu extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: 'drop',
        modifier: 'down',
        nested: false
    };

    static propTypes = {
        children: children(Divider, Header, Item),
        className: cssClass.isRequired,
        uniqueClassName: cssClass,
        modifier: PropTypes.oneOf(['up', 'down', 'left', 'right']),
        reverse: PropTypes.bool,
        nested: PropTypes.bool
    };

    /**
     * Render the drop menu.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            modifier = props.modifier;

        return (
            <div
                role="menu"
                id={props.nested ? null : this.formatID('drop-menu')}
                className={this.formatClass(props.className, {
                    ['@up']: (modifier === 'up'),
                    ['@down']: (modifier === 'down'),
                    ['@left']: (modifier === 'left'),
                    ['@right']: (modifier === 'right'),
                    'reverse-align': props.reverse,
                    'is-expanded': (!props.nested && this.context.expanded)
                })}
                {...this.inheritNativeProps(props)}>

                <ul>
                    {props.children}
                </ul>
            </div>
        );
    }
}
