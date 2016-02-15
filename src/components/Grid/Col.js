/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClassName from '../../prop-types/cssClassName';
import inNumberRange from '../../prop-types/inNumberRange';

const span6 = inNumberRange(1, 6);
const span12 = inNumberRange(1, 12);

export default class Col extends Component {
    static defaultProps = {
        className: 'col'
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,

        // This is ugly, a better way?
        span: span12,
        push: span12,
        pull: span12,
        xsmall: span6,
        xsmallPush: span6,
        xsmallPull: span6,
        small: span12,
        smallPush: span12,
        smallPull: span12,
        medium: span12,
        mediumPush: span12,
        mediumPull: span12,
        large: span12,
        largePush: span12,
        largePull: span12,
        end: PropTypes.bool
    };

    /**
     * Render the grid column.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            classes = {};

        Object.keys(Col.propTypes).forEach(key => {
            let span = props[key];

            if (span) {
                if (key === 'end') {
                    classes.end = true; // Must be last

                } else if (!key.match(/child|class/i)) {
                    classes[key.replace('P', '-p') + '-' + span] = true;
                }
            }
        });

        return (
            <div
                className={this.formatClass(props.className, classes)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
