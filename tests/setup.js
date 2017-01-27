/* eslint-disable no-console, no-unused-vars, func-names */

console.warn = jest.fn();
console.error = jest.fn();

/**
 * Process a callback in a separate thread so that expect()
 * calls will trigger accordingly if the DOM or timers are used.
 */
global.processInThread = function processInThread(func) {
  setTimeout(func, 0);
};
