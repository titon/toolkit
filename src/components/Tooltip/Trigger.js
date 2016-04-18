/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Trigger extends Component {
    static defaultProps = {
        elementClassName: ['tooltip', 'trigger']
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        inline: PropTypes.bool,
        tooltip: PropTypes.element.isRequired
    };

    /**
     * Render the tooltip trigger element.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            Tag = props.inline ? 'span' : 'div';

        return (
            <Tag className={this.formatClass(props.elementClassName, props.className)}>
                {props.children}
                {props.tooltip}
            </Tag>
        );
    }
}
