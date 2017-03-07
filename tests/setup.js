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

/**
 * Run a block of code in a production setting.
 */
global.runInProduction = function runInProduction(func) {
  process.env.NODE_ENV = 'production';
  func();
  process.env.NODE_ENV = 'test';
};
