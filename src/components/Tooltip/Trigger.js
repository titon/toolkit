/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Tooltip from './Tooltip';
import MODULE from './module';

export default class Trigger extends Component {
    static module = MODULE;

    static defaultProps = {
        inline: false
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        inline: PropTypes.bool,
        tooltip: PropTypes.oneOfType([PropTypes.element, PropTypes.node]).isRequired
    };

    /**
     * Render the tooltip trigger element.
     *
     * @returns {ReactElement}
     */
    render() {
        let { tooltip, ...props } = this.props,
            Tag = props.inline ? 'span' : 'div';

        // Convert to an element if not already one
        if (!React.isValidElement(tooltip)) {
            tooltip = (
                <Tooltip>{tooltip}</Tooltip>
            );
        }

        return (
            <Tag className={this.formatChildClass('trigger')}>
                {props.children}
                {tooltip}
            </Tag>
        );
    }
}
