import React from 'react';
import Titon from '../../Titon';
import classBuilder from '../../extensions/utility/classBuilder';

export default class Component extends React.Component {
    formatClass(className, params) {
        let classes = [];

        if (Titon.options.autoNamespace) {
            classes.push(Titon.options.namespace + className);
        } else {
            classes.push(className);
        }

        classes.push(classBuilder(params));

        return classes.join(' ').trim();
    }

    formatID(componentName) {
        let id = ['titon'],
            uid = this.props.uid || this.uid;

        if (typeof uid !== 'undefined') {
            id.push(uid);
        }

        id.push(componentName);

        if (typeof this.props.index !== 'undefined') {
            id.push(this.props.index);
        }

        return id.join('-').trim();
    }
}
