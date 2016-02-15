/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Col from './Col';
import childrenOfType from '../../prop-types/childrenOfType';
import cssClassName from '../../prop-types/cssClassName';

export default class Row extends Component {
    static defaultProps = {
        className: 'row'
    };

    static propTypes = {
        children: childrenOfType(Col),
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName
    };

    /**
     * Render the grid row.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                className={this.formatClass(props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
