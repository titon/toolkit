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
    cacheBust: false,
  };

  static propTypes = {
    ...LazyLoad.propTypes,
    alt: PropTypes.string,
    cacheBust: PropTypes.bool,
    filler: PropTypes.string,
    retinaSrc: PropTypes.string,
    src: PropTypes.string.isRequired,
  };

  getSourcePath() {
    const { src, retinaSrc, filler, cacheBust } = this.props;
    let sourcePath = filler || '';

    if (this.state.loaded) {
      sourcePath = (RETINA ? retinaSrc : '') || src;

        // Append a query string to bust the cache
      if (cacheBust) {
        const url = new URL(sourcePath);

        url.search += `${url.search.charAt(0) === '?' ? '&' : '?'}now=${Date.now()}`;

        sourcePath = String(url);
      }
    }

    return sourcePath;
  }

  render() {
    const { alt, retinaSrc } = this.props;

    return (
      <img
        ref={(ref) => { this.element = ref; }}
        alt={alt || ''}
        src={this.getSourcePath()}
        className={this.formatChildClass('image', {
          'is-loaded': this.state.loaded,
          'is-retina': (RETINA && retinaSrc),
        })}
      />
    );
  }
}
