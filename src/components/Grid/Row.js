/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint require-jsdoc: 0 */

import React from 'react';
import Col from './Col';
import childrenOf from '../../prop-types/children';
import MODULE from './module';

export default function Row({ children }) {
    return (
        <div className={MODULE.classNames.row}>
            {children}
        </div>
    );
}

Row.module = MODULE;

Row.propTypes = {
    children: childrenOf(Col)
};
