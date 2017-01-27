/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint-disable no-console */

import Titon from '../Titon';

/**
 * Emit a custom event on an instance of a React component,
 * and notify the listener defined on the prop with the same event name.
 * If the `debug` prop is enabled, print out helpful information.
 */
export default function emitEvent(component, contextName, eventName, ...args) {
  const displayName = component.constructor.name || component.displayName;
  const debug = component.props.debug || Titon.options.debug;
  let uid = null;

  if (component.context[contextName]) {
    uid = component.context[contextName].uid;
  } else {
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

  args.unshift({
    component: displayName,
    timestamp: Date.now(),
    eventName,
    uid,
  });

  const listener = component.props[eventName];

  if (listener) {
    listener(...args);
  }
}
