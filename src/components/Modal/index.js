/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Modal from './Modal';
import Body from './Body';
import Head from './Head';
import Foot from './Foot';
import Factory from './Factory';
import Container from './Container';
import CONTEXT_TYPES from './ContextTypes';

Modal.CONTEXT_TYPES = CONTEXT_TYPES;
Modal.Body = Body;
Modal.Head = Head;
Modal.Foot = Foot;
Modal.Factory = Factory;
Modal.Container = Container;

export { Body, Head, Foot, Factory, Container, CONTEXT_TYPES };
export default Modal;
