/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint no-console: 0, no-native-reassign: 0, no-undef: 0 */

import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

const suppressedLogs = [];
const originalConsole = console;
const shimConsole = (() => {
    let shim = {};

    // Use a fixed list of names as `console` is different between node and the browser
    [
        'log', 'info', 'warn', 'error', 'exception', 'debug', 'table', 'trace', 'dir', 'dirxml',
        'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd', 'timeStamp', 'profile',
        'profileEnd', 'assert', 'count', 'clear', 'markTimeline', 'timeline', 'timelineEnd'
    ].forEach(name => {
        shim[name] = preserveLog(name);
    });

    return shim;
})();

/**
 * Curries a function that preserves the original console message.
 *
 * @param {String} name
 * @returns {Function}
 */
function preserveLog(name) {
    return function preserveLogHandler(...args) {
        suppressedLogs.push({
            args,
            type: name
        });
    };
}

/**
 * The `suppressConsole` decorator will temporarily disable all console messages
 * for the duration of hte methods execution. All suppressed messages will be logged.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
function suppressConsole(target, name, descriptor) {
    checkIsMethod('suppressConsole', arguments);

    let func = getValueFunc('suppressConsole', descriptor);

    descriptor.value = function suppressConsoleValue() {
        console = shimConsole;

        let response = func.call(this, arguments);

        console = originalConsole;

        return response;
    };

    return descriptor;
}

suppressConsole.logs = suppressedLogs;

export { suppressedLogs };
export default suppressConsole;
