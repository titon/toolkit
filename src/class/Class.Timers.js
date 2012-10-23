/**
 * Titon: The Mootools UI Framework
 *
 * @copyright	Copyright 2006-2012, Titon
 * @license		http://opensource.org/licenses/mit-license.php - Licensed under the MIT License
 * @link		http://github.com/titon
 */

/**
 * Provides timer and interval management within the class layer.
 *
 * @version	1.0.0
 * @uses	Core
 */
Class.Timers = new Class({

	/**
	 * Collection of timer callback functions.
	 */
	timers: {},

	/**
	 * Collection of active timers.
	 */
	$timers: {},

	/**
	 * Add a timer callback function.
	 *
	 * @param {String} key
	 * @param {Function} fn
	 * @return {Class.Timers}
	 */
	addTimer: function(key, fn) {
		this.timers[key] = Function.from(fn);

		return this;
	},

	/**
	 * Add multiple timers.
	 *
	 * @param {Object} timers
	 * @return {Class.Timers}
	 */
	addTimers: function(timers) {
		for (var key in timers) {
			this.addTimer(key, timers[key]);
		}

		return this;
	},

	/**
	 * Start a timer that executes a function after a delay.
	 *
	 * @param {String} key
	 * @param {int} delay
	 * @param {Array} args
	 * @return {Class.Timers}
	 */
	startTimer: function(key, delay, args) {
		this.clearTimer(key);

		if (this.timers[key]) {
			this.$timers[key] = this.timers[key].delay(delay, this, args);
		}

		return this;
	},

	/**
	 * Start a timer that executes at every interval.
	 *
	 * @param {String} key
	 * @param {int} interval
	 * @param {Array} args
	 * @return {Class.Timers}
	 */
	startInterval: function(key, interval, args) {
		this.clearTimer(key);

		if (this.timers[key]) {
			this.$timers[key] = this.timers[key].periodical(interval, this, args);
		}

		return this;
	},

	/**
	 * Clear a timer or interval. If a function is passed, execute it.
	 *
	 * @param {String} key
	 * @param {Function} fn
	 * @param {Array} args
	 * @return {Class.Timers}
	 */
	clearTimer: function(key, fn, args) {
		window.clearTimeout(this.$timers[key]);

		delete this.$timers[key];

		if (typeOf(fn) === 'function') {
			fn.apply(this, args || []);
		}

		return this;
	},

	/**
	 * Clear all timers, or all timers defined by keys.
	 *
	 * @param {Array} timers
	 * @return {Class.Timers}
	 */
	clearTimers: function(timers) {
		if (timers) {
			Array.from(timers).each(function(value) {
				this.clearTimer(value);
			}, this);

		} else {
			Object.each(this.$timers, function(value, key) {
				this.clearTimer(key);
			}, this);
		}

		return this;
	},

	/**
	 * Remove a timer function.
	 *
	 * @param {String} key
	 * @return {Class.Timers}
	 */
	removeTimer: function(key) {
		delete this.timers[key];

		return this;
	},

	/**
	 * Remove all defined timers.
	 *
	 * @param {Array} timers
	 * @return {Class.Timers}
	 */
	removeTimers: function(timers) {
		Array.from(timers).each(function(value) {
			this.removeTimer(value);
		}, this);

		return this;
	}

});