/* eslint-disable no-console, no-unused-vars, func-names */

console.warn = jest.fn();
console.error = jest.fn();

/**
 * Process a callback in a separate thread so that mutations trigger instantly,
 * instead of waiting for the render loop.
 */
global.processInThread = function processInThread(func) {
  setTimeout(func, 0);
};
