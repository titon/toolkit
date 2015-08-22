'use strict';

var chalk = require('chalk');

function log(message, tabCount, lineCount) {
    var tabIndent = '',
        date = new Date(),
        timestamp = [date.getHours(), date.getMinutes(), + date.getSeconds()].map(function(time) {
            return pad(String(time), 2, '0');
        });

    while (tabCount) {
        tabIndent += '\t';
        tabCount--;
    }

    while (lineCount) {
        log('');
        lineCount--;
    }

    console.log(
        '[' + chalk.gray(timestamp.join(':')) + '] ' +
        tabIndent +
        message
    );
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

function pad(string, length, char) {
    while (string.length < length) {
        string = char + string;
    }

    return string;
}

module.exports = log;
