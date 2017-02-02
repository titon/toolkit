/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

export default function calculateDimensions(
  element: HTMLElement,
  axis: 'width' | 'height',
  includeMargin: boolean = false,
): number {
  let size = (axis === 'width') ? element.offsetWidth : element.offsetHeight;

  if (includeMargin) {
    const styles = window.getComputedStyle(element);

    if (axis === 'width') {
      size += parseFloat(styles.marginTop);
      size += parseFloat(styles.marginBottom);
    } else {
      size += parseFloat(styles.marginLeft);
      size += parseFloat(styles.marginRight);
    }
  }

  return size;
}
