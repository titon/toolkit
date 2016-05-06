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
import childrenOf from '../../prop-types/childrenOf';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Menu extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        direction: 'down',
        nested: false,
        reverse: false
    };

    static propTypes = {
        children: childrenOf(Divider, Header, Item),
        direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
        nested: PropTypes.bool,
        reverse: PropTypes.bool
    };

    /**
     * Render the drop menu.
     *
     * @returns {ReactElement}
     */
    render() {
        let { direction, ...props } = this.props,
            { expanded } = this.getContext();

        return (
            <div
                role="menu"
                id={props.nested ? null : this.formatID('drop-menu')}
                className={this.formatClass({
                    ['@down']: (direction === 'down'),
                    ['@left']: (direction === 'left'),
                    ['@right']: (direction === 'right'),
                    ['@up']: (direction === 'up'),
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
