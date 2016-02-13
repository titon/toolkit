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
import childrenOfType from '../../prop-types/childrenOfType';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Menu extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: 'drop',
        modifier: 'down',
        nested: false
    };

    static propTypes = {
        children: childrenOfType(Divider, Header, Item),
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
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
                    'is-open': (!props.nested && this.context.opened)
                })}
                {...this.inheritNativeProps(props)}>

                <ul>
                    {props.children}
                </ul>
            </div>
        );
    }
}
