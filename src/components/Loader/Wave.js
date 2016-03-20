/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Message from './Message';
import children from '../../prop-types/children';
import cssClass from '../../prop-types/cssClass';

export default class Wave extends Component {
    static defaultProps = {
        count: 5,
        elementClassName: 'loader',
        type: 'bar'
    };

    static propTypes = {
        children: children(Message),
        className: cssClass,
        count: PropTypes.number,
        elementClassName: cssClass.isRequired,
        type: PropTypes.oneOf(['bar', 'bubble'])
    };

    /**
     * Render the wave loader and generate a count of waves.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            waves = [];

        for (let i = 0; i < props.count; i++) {
            waves.push(<span key={i} />);
        }

        return (
            <div
                className={this.formatClass(props.elementClassName, props.className, {
                    [`@${props.type}-wave`]: true
                })}
                {...this.inheritNativeProps(props)}>

                {waves}
                {props.children}
            </div>
        );
    }
}
