/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import children from '../../prop-types/children';
import cssClass from '../../prop-types/cssClass';

export default class Table extends Component {
    static defaultProps = {
        elementClassName: 'table',
        responsiveClassName: ['table', 'responsive']
    };

    static propTypes = {
        children: children('colgroup', 'thead', 'tbody', 'tfoot'),
        className: cssClass,
        elementClassName: cssClass.isRequired,
        hoverable: PropTypes.bool,
        responsiveClassName: cssClass.isRequired,
        sortable: PropTypes.bool,
        striped: PropTypes.bool
    };

    /**
     * Render the outer table element.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div className={this.formatClass(props.responsiveClassName)}>
                <table
                    className={this.formatClass(props.elementClassName, props.className, {
                        'has-hover': props.hoverable,
                        'is-sortable': props.sortable,
                        'is-striped': props.striped
                    })}
                    {...this.inheritNativeProps(props)}>

                    {props.children}
                </table>
            </div>
        );
    }
}
