/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import bem from '../utility/bem';

/**
 * The `ClassBuilder` is a proper mechanism for building a list of possible
 * CSS class names that follow the BEM specification (Titon's version).
 * It should support all possible variations in a simple format.
 *
 * Instantiate with a primary class name:
 *
 *      let className =
 *          new ClassBuilder('unique');         // .unique
 *          new ClassBuilder('unique', 'pre-'); // .pre-unique
 *
 * Add secondary classes:
 *
 *      className
 *          .add('foo')                     // .foo
 *          .add('foo', 'element');         // .foo-element
 *          .add('foo', '', 'modifier');    // .foo--modifier
 *          .add(['foo', 'element'])        // .foo-element
 *          .add({                          // .foo--modifier
 *              block: 'foo',
 *              modifier: 'modifier'
 *          });
 *
 * Add modifier classes that append to the primary class:
 *
 *      className
 *          .mod('inverse')                 // .unique--inverse
 *          .mod('reverse');                // .unique--reverse
 *
 * Map modifier (@) and tertiary classes that evaluate to true:
 *
 *      className.map({
 *          'is-active': true,
 *          'is-disabled': false,
 *          'no-scroll': true,
 *          '@inverse': true
 *      });
 *
 * Cast to a string or call `toString()`:
 *
 *      String(className)
 *      className.toString()
 *
 */
export default class ClassBuilder {
    constructor(primaryClass, prefix = '') {
        if (!primaryClass) {
            throw new Error('`ClassBuilder` requires a primary class name.');
        }

        this.prefix = prefix;
        this.classes = [];

        // Add the primary class and then save a reference
        this.add(primaryClass);
        this.primaryClass = this.classes[0];
    }

    /**
     * Add a secondary BEM compatible class name.
     *
     * @param {String|Array} block
     * @param {String} [element]
     * @param {String} [modifier]
     * @param {Boolean} [prefix]
     * @returns {ClassBuilder}
     */
    add(block, element = '', modifier = '', prefix = true) {
        this.classes.push(
            (prefix ? this.prefix : '') + bem(block, element, modifier)
        );

        return this;
    }

    /**
     * Map a list of secondary classes and append all who's value evaluates to true.
     * Classes mapped this way must be literal strings and will not be prefixed or BEM-ed,
     * unless defined as a modifier.
     *
     * @param {Object} classes
     * @returns {ClassBuilder}
     */
    map(classes) {
        Object.keys(classes).forEach(key => {
            if (classes[key]) {
                if (key.charAt(0) === '@') {
                    this.mod(key.substr(1));

                } else {
                    this.classes.push(key);
                }
            }
        });

        return this;
    }

    /**
     * Add a modifier class based on the current primary class.
     *
     * @param {String} modifier
     * @returns {ClassBuilder}
     */
    mod(modifier) {
        // Primary should already be prefixed so don't do it again
        this.classes.push(bem(this.primaryClass, '', modifier));

        return this;
    }

    /**
     * Return all classes as a CSS valid string.
     *
     * @returns {String}
     */
    toString() {
        return this.classes.join(' ').trim();
    }
}
