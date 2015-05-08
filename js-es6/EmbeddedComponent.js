/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import Component from 'Component';

export default class EmbeddedComponent extends Component {

    // The element being wrapped by the plugin.
    element = null;

}

Toolkit.EmbeddedComponent = EmbeddedComponent;
