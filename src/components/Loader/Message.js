/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Message extends Component {
    static defaultProps = {
        elementClassName: ['loader', 'message']
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        className: cssClass,
        elementClassName: cssClass.isRequired
    };

    /**
     * Render the message within a loader.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div className={this.formatClass(props.elementClassName, props.className)}>
                {props.children}
            </div>
        );
    }
}
