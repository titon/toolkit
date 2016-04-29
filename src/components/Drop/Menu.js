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
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Menu extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        modifier: 'down',
        nested: false,
        reverse: false
    };

    static propTypes = {
        children: children(Divider, Header, Item),
        modifier: PropTypes.oneOf(['up', 'down', 'left', 'right']),
        nested: PropTypes.bool,
        reverse: PropTypes.bool
    };

    /**
     * Render the drop menu.
     *
     * @returns {ReactElement}
     */
    render() {
        let { modifier, ...props } = this.props,
            { expanded } = this.context;

        return (
            <div
                role="menu"
                id={props.nested ? null : this.formatID('drop-menu')}
                className={this.formatClass({
                    ['@down']: (modifier === 'down'),
                    ['@left']: (modifier === 'left'),
                    ['@right']: (modifier === 'right'),
                    ['@up']: (modifier === 'up'),
                    'is-branch': props.nested,
                    'is-expanded': (!props.nested && expanded),
                    'is-root': !props.nested,
                    'reverse-align': props.reverse
                })}
                {...this.inheritNativeProps(props)}
            >
                <ul>
                    {props.children}
                </ul>
            </div>
        );
    }
}
