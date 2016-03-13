/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Field from './Field';
import children from '../../prop-types/children';
import cssClass from '../../prop-types/cssClass';

export default class FieldList extends Component {
    static defaultProps = {
        elementClassName: 'fields'
    };

    static propTypes = {
        children: children(Field),
        className: cssClass,
        elementClassName: cssClass.isRequired
    };

    /**
     * Render the form field list wrapper.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <ol
                className={this.formatClass(props.elementClassName, props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </ol>
        );
    }
}
