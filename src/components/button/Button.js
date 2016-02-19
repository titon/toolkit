/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Button extends Component {
    static defaultProps = {
        elementClassName: 'button',
        url: '',
        size: '',
        shape: '',
        state: '',
        modifier: '',
        disabled: false
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        url: PropTypes.string,
        size: PropTypes.oneOf(['small', 'large']),
        shape: PropTypes.oneOf(['round', 'oval', 'pill', 'skew']),
        state: PropTypes.oneOf(['info', 'success', 'warning', 'error', 'debug']),
        modifier: PropTypes.oneOf(['gloss', 'reflect', 'glare', 'popout']),
        disabled: PropTypes.bool
    };

    render() {
        return (
            <button
                type="button" role="button"
                className="button">
                {this.props.children}
            </button>
        );
    }
}
