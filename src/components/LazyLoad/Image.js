/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import LazyLoad from './LazyLoad';
import { RETINA } from '../../flags';

export default class Image extends LazyLoad {
    static defaultProps = {
        ...LazyLoad.defaultProps,
        cacheBust: false
    };

    static propTypes = {
        ...LazyLoad.propTypes,
        alt: PropTypes.string,
        cacheBust: PropTypes.bool,
        filler: PropTypes.string,
        retinaSrc: PropTypes.string,
        src: PropTypes.string.isRequired
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
                ref="element"
                alt={props.alt || ''}
                src={this.getSourcePath()}
                className={this.formatChildClass('image', {
                    'is-loaded': this.state.loaded,
                    'is-retina': (RETINA && props.retinaSrc)
                })}
                {...this.inheritNativeProps(props)}
            />
        );
    }
}
