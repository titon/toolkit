/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010+, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * Provides timer and interval management within the class layer.
 *
 * @version	0.1
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
	 * @param {string} key
	 * @param {function} fn
	 * @return {Class}
	 */
	addTimer: function(key, fn) {
		this.timers[key] = Function.from(fn);

		return this;
	},

	/**
	 * Add multiple timers.
	 *
	 * @param {object} timers
	 * @return {Class}
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
	 * @param {string} key
	 * @param {int} delay
	 * @param {array} args
	 * @return {Class}
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
	 * @param {string} key
	 * @param {int} interval
	 * @param {array} args
	 * @return {Class}
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
	 * @param {string} key
	 * @param {function} fn
	 * @param {array} args
	 * @return {Class}
	 */
	clearTimer: function(key, fn, args) {
		window.clearTimeout(this.$timers[key]);

		delete this.$timers[key];

		if (typeOf(fn) === 'function') {
			fn.apply(this, args);
		}

		return this;
	},

	/**
	 * Clear all timers, or all timers defined by keys.
	 *
	 * @param {array} timers
	 * @return {Class}
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
	 * @param {string} key
	 * @return {Class}
	 */
	removeTimer: function(key) {
		delete this.timers[key];

		return this;
	},

	/**
	 * Remove all defined timers.
	 *
	 * @param {array} timers
	 * @return {Class}
	 */
	removeTimers: function(timers) {
		Array.from(timers).each(function(value) {
			this.removeTimer(value);
		}, this);

		return this;
	}

});