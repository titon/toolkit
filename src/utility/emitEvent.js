/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/* eslint-disable no-console */

import React from 'react';
import Titon from '../Titon';

/**
 * Emit a custom event on an instance of a React component,
 * and notify the listener defined on the prop with the same event name.
 * If the `debug` prop is enabled, print out helpful information.
 */
export default function emitEvent(
  component: React.Component<*, *, *>,
  contextName: string,
  eventName: string,
  ...args: *[]
) {
  if (process.env.NODE_ENV !== 'production') {
    // $FlowIgnore
    const displayName = component.constructor.name || component.displayName;
    const debug = component.props.debug || Titon.options.debug;
    let uid = '';

    if (contextName && component.context[contextName]) {
      uid = component.context[contextName].uid;
    } else {
      // $FlowIgnore
      uid = component.uid;
    }

    if (debug) {
      console.info(
        `${displayName}${uid ? `#${uid}` : ''}`,
        (Date.now() / 1000).toFixed(3),
        eventName,
        args,
      );

      if (debug === 'verbose') {
        console.dir(component);
      }
    }
  }

  const listener = component.props[eventName];

  if (listener) {
    listener(...args);
  }
}
