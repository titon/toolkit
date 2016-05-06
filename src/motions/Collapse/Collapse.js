/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import Component from '../../Component';

export default class Collapse extends Component {
    static defaultProps = {
        direction: 'vertical',
        expanded: true
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        direction: PropTypes.oneOf(['vertical', 'horizontal']),
        expanded: PropTypes.bool.isRequired,
        fixedHeight: PropTypes.number,
    };

    state = {
        size: -1
    };

    handleOnLeave() {

    }

    render() {
        return (
            <TransitionMotion
                willLeave={this.handleOnLeave}
            >

            </TransitionMotion>
        );
    }
}
