/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import cssClassName from '../../prop-types/cssClassName';

export default class Divider extends Component {
    static defaultProps = {
        className: ['drop', 'divider']
    };

    static propTypes = {
        className: cssClassName.isRequired
    };

    /**
     * Render the drop item divider.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props;

        return (
            <li
                role="separator"
                className={this.formatClass(props.className)}
                {...this.inheritNativeProps(props)} />
        );
    }

}
