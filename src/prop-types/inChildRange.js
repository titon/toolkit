/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import { PropTypes, Children } from 'react';

/**
 * A function that will validate a prop is numeric, and that its value is within range of the
 * number of children within the component..
 *
 * @param {Object} props
 * @param {String} propName
 * @param {String} componentName
 * @returns {?Error}
 */
export default function inChildRange(props, propName, componentName) {
    let value = props[propName],
        error = PropTypes.number(value);

    if (error === null && (value < 0 || value >= Children.count(props.children))) {
        error = new Error(`Invalid prop \`${propName}\` value, must not exceed the number of \`${componentName}\` children.`);
    }

    return error;
}
