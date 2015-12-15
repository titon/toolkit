/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Titon from '../../Titon';
import classBuilder from '../../ext/utility/classBuilder';
import generateUID from '../../ext/utility/generateUID';

export default class Component extends React.Component {
    constructor() {
        super();

        this.uid = generateUID();
        this.state = {};
        this.version = '3.0.0';
    }

    emitEvent(event, args) {
        let propName = 'on' + event.charAt(0).toUpperCase() + event.substr(1),
            listeners = this.props[propName];

        if (!listeners) {
            return;
        } else if (!Array.isArray(listeners)) {
            listeners = [listeners];
        }

        listeners.forEach(func => func.apply(this, args));
    }

    formatClass(className, params) {
        if (Titon.options.autoNamespace) {
            className = Titon.options.namespace + className;
        }

        return classBuilder(className, params);
    }

    formatID(...params) {
        let id = ['titon'],
            uid = this.context.uid || this.uid;

        if (typeof uid !== 'undefined') {
            id.push(uid);
        }

        id = id.concat(params);

        return id.join('-').trim();
    }
}
