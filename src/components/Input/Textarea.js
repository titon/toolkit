/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Input from './Input';

export default class Textarea extends Input {
  /**
   * Render the textarea with the props gathered from its declaration.
   *
   * @returns {ReactElement}
   */
  render() {
    return (
      <textarea {...this.gatherProps()} />
    );
  }
}
