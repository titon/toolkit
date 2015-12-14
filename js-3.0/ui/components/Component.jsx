import React from 'react';
import Titon from '../../Titon';
import classBuilder from '../../ext/utility/classBuilder';

export default class Component extends React.Component {
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

        return [className, classBuilder(params)].join(' ').trim();
    }

    formatID(idName) {
        let id = ['titon'],
            uid = this.context.uid || this.uid;

        if (typeof uid !== 'undefined') {
            id.push(uid);
        }

        id.push(idName);

        if (typeof this.props.index !== 'undefined') {
            id.push(this.props.index);
        }

        return id.join('-').trim();
    }
}
