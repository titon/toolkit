/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint require-jsdoc: 0 */

import React, { PropTypes } from 'react';
import Col from './Col';
import children from '../../prop-types/children';
import formatClass from '../../utility/formatClass';

export default function Row(props) {
    return (
        <div className={formatClass(props.className)}>
            {props.children}
        </div>
    );
}

Row.defaultProps = {
    className: 'row'
};

Row.propTypes = {
    children: children(Col),
    className: PropTypes.string.isRequired
};
