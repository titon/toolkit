/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Titon from '../Titon';

const cookies = {};

class CookieJar {
  loaded = false;
  raw = false;

  /**
   * Decode an encoded value, or return the raw value.
   *
   * @param {String} value
   * @returns {String}
   */
  decode(value) {
    return this.raw ? value : decodeURIComponent(value);
  }

  /**
   * Encode a value, or return the raw value.
   *
   * @param {*} value
   * @returns {String}
   */
  encode(value) {
    return this.raw ? value : encodeURIComponent(value);
  }

  /**
   * Return the cookie value if it exists, else return null.
   *
   * @param {String} key
   * @returns {*}
   */
  get(key) {
    return this.has(key) ? cookies[key] : null;
  }

  /**
   * Return true if a cookie has been set by the defined key.
   *
   * @param {String} key
   * @returns {Boolean}
   */
  has(key) {
    this.load();

    return (key in cookies);
  }

  /**
   * Load all the currently defined cookies on the document into memory.
   */
  load() {
    if (this.loaded) {
      return;
    }

    const documentCookies = document.cookie;

    if (documentCookies) {
      documentCookies.split(';').forEach((cookie) => {
        let [key, value] = cookie.split('=', 2);

        key = this.decode(key).replace(Titon.options.cookiePrefix, '');
        cookies[key] = value = this.decode(value);
      });
    }

    this.loaded = true;
  }

  /**
   * Remove a cookie by the defined key.
   *
   * @param {String} key
   * @param {Object} [options]
   */
  remove(key, options = {}) {
    options.expires = -1;

    this.add(key, '[removed]', options);
  }

  /**
   * Set a cookie by writing to the document.
   *
   * @param {String} key
   * @param {*} value
   * @param {Object} [options]
   */
  set(key, value, options = {}) {
    // Convert to JSON if not primitive
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }

    // Add days to current timestamp if a number
    if (typeof options.expires === 'number') {
      const date = new Date();

      date.setHours(options.expires * 24);

      options.expires = date;
    }

        /* eslint no-multi-spaces: 0 */
    cookies[key] = [
      this.encode(Titon.options.cookiePrefix + key), '=', this.encode(value),
      options.expires ? `; expires=${options.expires.toUTCString()}` : '',
      options.path    ? `; path=${options.path}` : '',
      options.domain  ? `; domain=${options.domain}` : '',
      options.secure  ? '; secure' : '',
    ].join('');

    document.cookie = cookies[key];
  }
}

export default new CookieJar();
