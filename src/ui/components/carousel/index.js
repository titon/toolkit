/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Carousel from './Carousel';
import Item from './Item';
import ItemList from './ItemList';
import TabList from './TabList';
import Start from './Start';
import Stop from './Stop';
import Next from './Next';
import Prev from './Prev';
import CONTEXT_TYPES from './ContextTypes';

Carousel.Item = Item;
Carousel.ItemList = ItemList;
Carousel.TabList = TabList;
Carousel.Start = Start;
Carousel.Stop = Stop;
Carousel.Next = Next;
Carousel.Prev = Prev;

export { Item, ItemList, TabList, Start, Stop, Next, Prev, CONTEXT_TYPES };
export default Carousel;
