/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import LazyLoad from './LazyLoad';

export default class Background extends LazyLoad {
    /**
     * Render the lazy loaded element.
     *
     * @returns {ReactElement}
     */
  render() {
    return this.transferToChild(this.props.children, {
      className: this.formatChildClass('bg', {
        'is-loaded': this.state.loaded,
      }),
      ref: 'element',
    });
  }
}
