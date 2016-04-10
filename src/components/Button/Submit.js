/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Button from './Button';

export default class Submit extends Button {
    static defaultProps = {
        ...Button.defaultProps,
        type: 'submit'
    };
}
