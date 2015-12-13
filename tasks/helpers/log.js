/* eslint strict: 0, no-var: 0, no-console: 0 */

'use strict';

var chalk = require('chalk');

/**
 * Pad a string with a character on either the left or right.
 *
 * @param {String} string
 * @param {Number} length
 * @param {String} char
 * @param {Boolean} left
 * @returns {String}
 */
function pad(string, length, char, left) {
    while (string.length < length) {
        if (left) {
            string = char + string;
        } else {
            string += char;
        }
    }

    return string;
}

/**
 * Write a message to the console.
 *
 * @param {String} message
 * @param {Number} [tabCount]
 * @param {Number} [lineCount]
 */
function log(message, tabCount, lineCount) {
    let tabIndent = '',
        date = new Date(),
        timestamp = [date.getHours(), date.getMinutes(), date.getSeconds()].map(function(time) {
            return pad(String(time), 2, '0', true);
        });

    while (tabCount) {
        tabIndent += '\t';
        tabCount--;
    }

    while (lineCount) {
        log('');
        lineCount--;
    }

    console.log('[' + chalk.gray(timestamp.join(':')) + '] ' + tabIndent + message);
}

log.title = function(message) {
    log(chalk.cyan.bold(message));
};

log.info = function(message, tabCount, lineCount) {
    log(chalk.cyan(message), tabCount, lineCount);
};

log.warn = function(message, tabCount, lineCount) {
    log(chalk.yellow(message), tabCount, lineCount);
};

log.error = function(message, tabCount, lineCount) {
    log(chalk.red(message), tabCount, lineCount);
};

log.success = function(message, tabCount, lineCount) {
    log(chalk.green(message), tabCount, lineCount);
};

log.stack = function(error) {
    let lines = [],
        message = '',
        maxLength = 0;

    error.stack.split('\n').forEach(function(line, i) {
        line = ' ' + line + ' '; // Pad it

        if (line.length > maxLength) {
            maxLength = line.length;
        }

        if (i === 0) {
            message = line;
        } else {
            lines.push(line);
        }
    });

    console.log();
    console.log(chalk.bgRed(pad('', maxLength, ' ')));
    console.log(chalk.bgRed.white.bold(pad(message, maxLength, ' ')));
    console.log(chalk.bgRed(pad('', maxLength, ' ')));

    lines.forEach(function(line) {
        console.log(chalk.bgRed.white(pad(line, maxLength, ' ')));
    });

    console.log(chalk.bgRed(pad('', maxLength, ' ')));
};

module.exports = log;
