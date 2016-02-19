/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import states from '../../prop-types/states';

export default class Bar extends Component {
    static defaultProps = {
        className: ['progress', 'bar']
    };

    static propTypes = {
        className: cssClass.isRequired,
        percent: PropTypes.number.isRequired,
        state: states
    };

    /**
     * Render the progress bar segment.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                className={this.formatClass(props.className, {
                    ['is-' + props.state]: Boolean(props.state)
                })}
                style={{ width: props.percent + '%' }}
                {...this.inheritNativeProps(props)}>

                {props.percent}%
            </div>
        );
    }
}
