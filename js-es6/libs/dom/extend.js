/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import transitionEnd from '../event';
import { chain, getter, setter } from '../util';

/**
 * Add a class to an element.
 *
 * @param {string} className
 * @returns {HTMLElement}
 */
function addClass(className) {
    this.classList.add(className);

    return this;
}

/**
 * Verify that a class exists on an element.
 *
 * @param {string} className
 * @returns {HTMLElement}
 */
function hasClass(className) {
    this.classList.contains(className);

    return this;
}

/**
 * Remove a class from an element.
 *
 * @param {string} className
 * @returns {HTMLElement}
 */
function removeClass(className) {
    this.classList.remove(className);

    return this;
}

/**
 * Conceal the element by applying the hide class.
 * Should be used to trigger transitions and animations.
 *
 * @param {boolean} [dontHide]
 * @returns {HTMLElement}
 */
function conceal(dontHide) {
    if (this.hasClass('show') && !dontHide) {
        transitionEnd(this, () => this.setStyle('display', 'none'));
    }

    return this
        .removeClass('show')
        .addClass('hide')
        .setAria('hidden', true);
}

/**
 * Reveal the element by applying the show class.
 * Should be used to trigger transitions and animations.
 *
 * @param {boolean} [dontShow]
 * @returns {HTMLElement}
 */
function reveal(dontShow) {
    if (!dontShow) {
        this.setStyle('display', '');
    }

    // We must place in a timeout or transitions do not occur
    setTimeout(() => {
        this.removeClass('hide')
            .addClass('show')
            .setAria('hidden', false);
    }, 1);

    return this;
}

/**
 * Set a value, or a mapping of values, for a defined ARIA attribute.
 * If ARIA is disabled globally, this will do nothing.
 *
 * @param {string|object} key
 * @param {*} value
 * @returns {HTMLElement}
 */
function setAria(key, value) {
    if (!Toolkit.aria) {
        return this;
    }

    if (key === 'toggled') {
        return this.setAria({ expanded: value, selected: value });
    }

    return this.setAttribute('aria-' + key, String(value));
}

let multiSetAria = setter(setAria);

/**
 * Set a style attribute directly on an element. This will not auto-format
 * the property or value.
 *
 * @param {string} key
 * @param {*} value
 * @returns {HTMLElement}
 */
function setStyle(key, value) {
    this.style[key] = value;

    return this;
}

let multiSetStyle = setter(setStyle);

/**
 * Will extend an element directly with new methods and functionality.
 * This *will not* extend the prototype, so will be much safer in most, if not all of cases.
 *
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export default function extend(element) {
    if (!element || element.extendedByToolkit) {
        return element;
    }

    element.addClass = addClass.bind(element);
    element.hasClass = hasClass.bind(element);
    element.removeClass = removeClass.bind(element);
    element.conceal = conceal.bind(element);
    element.reveal = reveal.bind(element);
    element.setAria = multiSetAria.bind(element);
    element.setAttribute = chain(element.setAttribute).bind(element);
    element.setAttributes = setter(element.setAttribute).bind(element);
    element.setStyle = setStyle.bind(element);
    element.setStyles = multiSetStyle.bind(element);
    element.extendedByToolkit = true;

    return element;
}
