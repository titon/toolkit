import React from 'react';

/**
 * A function that will validate that a prop is either a function, or an array of functions.
 *
 * @returns {Function}
 */
export default function funcCollection() {
    return React.PropTypes.oneOfType([
        React.PropTypes.func,
        React.PropTypes.arrayOf(React.PropTypes.func)
    ]);
}
