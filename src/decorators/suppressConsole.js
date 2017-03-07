/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/* eslint no-console: 0, no-native-reassign: 0, no-undef: 0, no-global-assign: 0 */

import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

import type { DecoratorTarget, Descriptor } from '../types';

const suppressedLogs = [];
const originalConsole = console;

/**
 * Curries a function that preserves the original console message.
 */
function preserveLog(name: string) {
  return function preserveLogHandler(...args: *[]) {
    suppressedLogs.push({
      args,
      type: name,
    });
  };
}

const shimConsole = (() => {
  const shim = {};

  // Use a fixed list of names as `console` is different between node and the browser
  [
    'log', 'info', 'warn', 'error', 'exception', 'debug', 'table', 'trace', 'dir', 'dirxml',
    'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'timeStamp', 'profile',
    'profileEnd', 'assert', 'count', 'clear', 'markTimeline', 'timeline', 'timelineEnd',
  ].forEach((name: string) => {
    shim[name] = preserveLog(name);
  });

  return shim;
})();

/**
 * The `suppressConsole` decorator will temporarily disable all console messages
 * for the duration of hte methods execution. All suppressed messages will be logged.
 */
function suppressConsole(
  target: DecoratorTarget,
  name: string,
  descriptor: Descriptor,
): Descriptor {
  if (process.env.NODE_ENV !== 'production') {
    checkIsMethod('suppressConsole', arguments);
  }

  const func = getValueFunc('suppressConsole', descriptor);

  descriptor.value = function suppressConsoleValue() {
    console = shimConsole;

    const response = func.call(this, arguments);

    console = originalConsole;

    return response;
  };

  return descriptor;
}

export { suppressedLogs };
export default suppressConsole;
