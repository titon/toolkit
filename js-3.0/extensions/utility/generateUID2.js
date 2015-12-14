/**
 * Generate a random unique identifier.
 *
 * @returns {String}
 */
export default function generateUID() {
    return Math.random().toString(32).substr(2);
}
