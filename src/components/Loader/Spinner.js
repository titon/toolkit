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

export default class Spinner extends Component {
    static defaultProps = {
        elementClassName: 'loader',
        spinnerClassName: ['loader', 'spinner'],
        type: 'bubble'
    };

    static propTypes = {
        children: children(Message),
        className: cssClass,
        elementClassName: cssClass.isRequired,
        spinnerClassName: cssClass.isRequired,
        type: PropTypes.oneOf(['bubble'])
    };

    /**
     * Render the spinner loader and generate a count of spinners.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            spinners = [];

        for (let i = 0; i < 8; i++) {
            spinners.push(<span key={i} />);
        }

        return (
            <div
                className={this.formatClass(props.elementClassName, props.className, {
                    [`@${props.type}-spinner`]: true
                })}
                {...this.inheritNativeProps(props)}>

                <div className={this.formatClass(props.spinnerClassName)}>
                    {spinners}
                </div>

                {props.children}
            </div>
        );
    }
}
