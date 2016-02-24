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
        elementClassName: ['lazy-load', 'image'],
        cacheBust: false,
        ...LazyLoad.defaultProps
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        src: PropTypes.string.isRequired,
        retinaSrc: PropTypes.string,
        filler: PropTypes.string,
        cacheBust: PropTypes.bool,
        ...LazyLoad.propTypes
    };

    /**
     * Determine the correct image source path based on the loaded state,
     * whether the browser supports retina, and the default source and filler images.
     *
     * If `cacheBust` is enabled, a query string param will be appended
     * with the current timestamp.
     *
     * @returns {String}
     */
    getSourcePath() {
        let { src, retinaSrc, filler, cacheBust } = this.props,
            sourcePath = filler || '';

        if (this.state.loaded) {
            sourcePath = (RETINA ? retinaSrc : '') || src;

            // Append a query string to bust the cache
            if (cacheBust) {
                let url = new URL(sourcePath);

                url.search += (url.search.charAt(0) === '?' ? '&' : '?') + 'now=' + Date.now();

                sourcePath = String(url);
            }
        }

        return sourcePath;
    }

    /**
     * Render the lazy loaded image.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <img
                alt=""
                ref="element"
                src={this.getSourcePath()}
                className={this.formatClass(props.elementClassName, props.className, {
                    'is-loaded': this.state.loaded,
                    'is-retina': (RETINA && props.retinaSrc)
                })}
                {...this.inheritNativeProps(props)} />
        );
    }
}
