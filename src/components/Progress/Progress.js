/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Bar from './Bar';
import childrenOfType from '../../prop-types/childrenOfType';
import cssClassName from '../../prop-types/cssClassName';

export default class Progress extends Component {
    static defaultProps = {
        className: 'progress',
        max: 100,
        min: 0,
        now: 0
    };

    static propTypes = {
        children: childrenOfType(Bar),
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
        size: PropTypes.oneOf(['small', 'large']),
        max: PropTypes.number,
        min: PropTypes.number,
        now: PropTypes.number
    };

    /**
     * Render the progress bar.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            min = props.min,
            max = props.max;

        return (
            <div
                role="progressbar"
                className={this.formatClass(props.className, {
                    ['@' + props.size]: Boolean(props.size)
                })}
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={Math.min(Math.max(props.now, min), max)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
