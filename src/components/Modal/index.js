/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Modal from './Modal';
import Body from './Body';
import Head from './Head';
import Foot from './Foot';
import Gate from './Gate';
import CONTEXT_TYPES from './ContextTypes';

Modal.CONTEXT_TYPES = CONTEXT_TYPES;
Modal.Body = Body;
Modal.Head = Head;
Modal.Foot = Foot;
Modal.Gate = Gate;

export { Body, Head, Foot, Gate, CONTEXT_TYPES };
export default Modal;
