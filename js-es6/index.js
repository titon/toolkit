/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import Module from 'Module';

import Component from 'Component';
import EmbeddedComponent from 'EmbeddedComponent';
import RenderedComponent from 'RenderedComponent';
import ContainerComponent from 'ContainerComponent';
import Accordion from 'components/Accordion';

import Event from 'events/Event';
import Swipe from 'events/Swipe';
import ClickOut from 'events/ClickOut';
import HorizontalResize from 'events/HorizontalResize';
import VerticalResize from 'events/VerticalResize';

import Collection from 'libs/dom/Collection';
import Element from 'libs/dom/Element';
import once from 'libs/event/once';
import swipe from 'libs/event/swipe';
import delegate from 'libs/event/delegate';
import clickOut from 'libs/event/clickOut';
import transitionEnd from 'libs/event/transitionEnd';
import bem from 'libs/utility/bem';

Toolkit.Module = Module;

// Behaviors

// Components
Toolkit.Component = Component;
Toolkit.EmbeddedComponent = EmbeddedComponent;
Toolkit.RenderedComponent = RenderedComponent;
Toolkit.ContainerComponent = ContainerComponent;
Toolkit.Accordion = Accordion;

// Events
Toolkit.Event = Event;
Toolkit.Event.once = once;
Toolkit.Event.swipe = swipe;
Toolkit.Event.delegate = delegate;
Toolkit.Event.clickOut = clickOut;
Toolkit.Event.transitionEnd = transitionEnd;
Toolkit.Swipe = Swipe;
Toolkit.ClickOut = ClickOut;
Toolkit.HorizontalResize = HorizontalResize;
Toolkit.VerticalResize = VerticalResize;

// Other
Toolkit.Element = Element;
Toolkit.ElementCollection = Collection;
Toolkit.bem = bem;
