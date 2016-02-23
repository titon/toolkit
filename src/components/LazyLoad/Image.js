/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import LazyLoad from './LazyLoad';
import cssClass from '../../prop-types/cssClass';
import { RETINA } from '../../flags';

export default class Image extends LazyLoad {
    static defaultProps = {
        elementClassName: 'lazy-load',
        threshold: 150,
        delay: 10000
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        src: PropTypes.string.isRequired,
        retinaSrc: PropTypes.string,
        fillSrc: PropTypes.string,
        threshold: PropTypes.number,
        delay: PropTypes.number
    };

    /**
     * Render the lazy loaded image.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            loaded = this.state.loaded,
            src = props.fillSrc;

        if (loaded) {
            src = (RETINA ? props.retinaSrc : '') || props.src;
        }

        return (
            <img alt=""
                src={src || ''}
                className={this.formatClass(props.className, {
                    [props.elementClassName]: !loaded,
                    'is-loaded': loaded
                })}
                {...this.inheritNativeProps(props)} />
        );
    }
}
