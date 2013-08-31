/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function(window) {
	'use strict';

window.Cache = new Class({

	/** Storage engine */
	storage: null,

	/**
	 * Set the storage engine to use.
	 *
	 * @param {String} type
	 */
	setStorage: function(type) {
		if (!window.JSON) {
			throw new Error('JSON is required for caching and storage');
		}

		// Fall through each storage layer till one is found
		switch (type.toLowerCase()) {
			case 'local':
			case 'localstorage':
				if (window.localStorage) {
					try {
						window.localStorage.setItem('_temp_', 'Titon');
						window.localStorage.removeItem('_temp_');

						this.storage = window.localStorage;
						return;
					} catch (LocalStorageError) {
					}
				}
				/* falls through */
			case 'session':
			case 'sessionstorage':
				if (window.sessionStorage) {
					try {
						window.sessionStorage.setItem('_temp_', 'Titon');
						window.sessionStorage.removeItem('_temp_');

						this.storage = window.sessionStorage;
						return;
					} catch (SessionStorageError) {
					}
				}
				/* falls through */
			default:
				this.storage = (function() {
					var memory = {},
						length = 0;

					return {
						length: length,
						clear: function() {
							memory = {};
							length = 0;
						},
						getItem: function(key) {
							return memory[key] || null;
						},
						setItem: function(key, value) {
							memory[key] = value;
							length++;
						},
						removeItem: function(key) {
							delete memory[key];
							length--;
						}
					};
				})();
			break;
		}
	},

	/**
	 * Return the cache size.
	 *
	 * @returns {int}
	 */
	cacheSize: function() {
		return this.storage.length || 0;
	},

	/**
	 * Empty the cache.
	 */
	flushCache: function() {
		if (this.storage) {
			this.storage.clear();
		}
	},

	/**
	 * Return a cache item by key.
	 * If the item exists, parse it from JSON.
	 *
	 * @param {String} key
	 * @returns {*}
	 */
	getCache: function(key) {
		if (this.storage && key) {
			var value = this.storage.getItem(key);

			if (value) {
				return JSON.parse(value);
			}
		}

		return null;
	},

	/**
	 * Return true if the cache item exists.
	 *
	 * @param {String} key
	 * @returns {bool}
	 */
	hasCache: function(key) {
		return (this.storage && this.storage.getItem(key));
	},

	/**
	 * Set an item into the cache.
	 *
	 * @param {String} key
	 * @param {*} value
	 * @returns {bool}
	 */
	setCache: function(key, value) {
		if (this.storage && key) {
			try {
				this.storage.setItem(key, JSON.stringify(value || ''));

				return true;
			} catch (OverflowError) {
			}
		}

		return false;
	},

	/**
	 * Remove an item from cache.
	 *
	 * @param {String} key
	 */
	removeCache: function(key) {
		if (this.storage && key) {
			this.storage.removeItem(key);
		}
	}

});

})(window);