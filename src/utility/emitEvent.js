/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint-disable no-console */

import Titon from '../Titon';

/**
 * Emit a custom event on an instance of a React component,
 * and notify all listeners defined on the prop with the same event name.
 * If the `debug` prop is enabled, print out helpful information.
 *
 * @param {ReactComponent} compInstance
 * @param {String} eventName
 * @param {...*} [args]
 */
export default function emitEvent(compInstance, eventName, ...args) {
  const { module, name } = compInstance.constructor;
  const debug = compInstance.props.debug || Titon.options.debug;
  const uid = compInstance.context[module.contextKey].uid || compInstance.uid;

  if (debug && window.console) {
    console.log(
      `${module.name}.${name}${uid ? `#${uid}` : ''}`,
      (Date.now() / 1000).toFixed(3),
      eventName,
      args,
    );

    if (debug === 'verbose') {
      console.dir(compInstance);
    }
  }

  args.unshift({
    component: name,
    timestamp: Date.now(),
    eventName,
    uid,
  });

  let listeners = this.props[eventName];

  if (!listeners) {
    return;
  } else if (!Array.isArray(listeners)) {
    listeners = [listeners];
  }

  listeners.forEach((func) => { func(...args); });
}
