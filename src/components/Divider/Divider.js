/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Divider extends Component {
    static defaultProps = {
        elementClassName: 'divider'
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired
    };

    /**
     * Render the divider.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                role="separator"
                className={this.formatClass(props.elementClassName, props.className)}
                {...this.inheritNativeProps(props)}>

                <span>{props.children}</span>
            </div>
        );
    }
}
