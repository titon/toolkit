/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Input from './Input';
import Choice from './Choice';
import Select from './Select';
import Static from './Static';
import Textarea from './Textarea';
import PropTypes from './PropTypes';

Input.PropTypes = PropTypes;
Input.Choice = Choice;
Input.Select = Select;
Input.Static = Static;
Input.Textarea = Textarea;

export { Choice, Select, Static, Textarea };
export default Input;
